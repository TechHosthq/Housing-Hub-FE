import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import paymentService from '@/services/paymentService';
import { useAuthStore } from '@/store/useAuthStore';
import { PaymentStatus } from '@/types/payment';

/**
 * How often the return page asks the server whether a payment has landed.
 *
 * Settlement is not instant: the payer's browser comes back from the gateway
 * before — sometimes well before — the provider's webhook reaches us. Three
 * seconds is frequent enough to feel immediate and slow enough not to hammer the
 * API while somebody stares at a spinner.
 */
const SETTLEMENT_POLL_MS = 3_000;

/**
 * How long to keep asking before telling the payer to check back.
 *
 * A cap matters because the alternative is a page that spins forever when a
 * webhook never arrives. Two minutes, then a message that says what is true —
 * the payment may still complete, and their receipt will show it — rather than
 * an error implying it failed.
 */
const SETTLEMENT_POLL_TIMEOUT_MS = 120_000;

export const usePayment = () => {
    const queryClient = useQueryClient();

    // Every endpoint here needs a session. Without this guard the account sidebar
    // asks for a signed-out visitor's payments on the public privacy page, which
    // 401s and sets the axios interceptor off attempting a token refresh — noise at
    // best, and a refresh racing a real sign-in at worst.
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    /** What a verification case costs. */
    const useVerificationQuote = (caseId: string | null) => useQuery({
        queryKey: ['payment-quote', caseId],
        queryFn: () => paymentService.quoteVerificationCase(caseId!),
        enabled: !!caseId && isAuthenticated,
    });

    /**
     * One payment, polled while it is still pending.
     *
     * Stops as soon as the payment reaches any settled state, and gives up after
     * SETTLEMENT_POLL_TIMEOUT_MS rather than polling for the life of the tab.
     */
    const usePaymentByReference = (reference: string | null) => useQuery({
        queryKey: ['payment', reference],
        queryFn: () => paymentService.getByReference(reference!),
        enabled: !!reference && isAuthenticated,
        refetchInterval: (query) => {
            const status = query.state.data?.data?.status;

            // Anything other than Pending is final as far as this page is
            // concerned — including Flagged, which needs a person rather than
            // another request.
            if (status !== undefined && status !== PaymentStatus.Pending) return false;

            // dataUpdatedAt is 0 until the first response, so this only starts
            // counting once there is something to count from.
            const startedAt = query.state.dataUpdatedAt || Date.now();
            if (Date.now() - startedAt > SETTLEMENT_POLL_TIMEOUT_MS) return false;

            return SETTLEMENT_POLL_MS;
        },
    });

    const useMyPayments = () => useQuery({
        queryKey: ['payments'],
        queryFn: () => paymentService.getMine(),
        enabled: isAuthenticated,
    });

    const initialiseMutation = useMutation({
        mutationFn: ({ caseId, callbackUrl }: { caseId: string; callbackUrl?: string }) =>
            paymentService.initialiseVerificationPayment(caseId, callbackUrl),
        // The quote's isAlreadyPaid changes once an attempt settles, and the case's
        // own submit-ability depends on it, so both are refetched rather than
        // patched — the server is what decides whether a case can be submitted.
        onSuccess: (_, { caseId }) => {
            queryClient.invalidateQueries({ queryKey: ['payment-quote', caseId] });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        },
    });

    return {
        useVerificationQuote,
        usePaymentByReference,
        useMyPayments,
        initialisePayment: initialiseMutation.mutateAsync,
        isInitialisingPayment: initialiseMutation.isPending,
    };
};
