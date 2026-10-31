import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import payoutService from '@/services/payoutService';
import { useAuthStore } from '@/store/useAuthStore';

export const usePayout = () => {
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const useBanks = () => useQuery({
        queryKey: ['payout-banks'],
        queryFn: () => payoutService.getBanks(),
        enabled: isAuthenticated,
        // The list of Nigerian banks does not change during a session.
        staleTime: Infinity,
    });

    const useMyPayoutAccount = () => useQuery({
        queryKey: ['payout-account'],
        queryFn: () => payoutService.getMine(),
        enabled: isAuthenticated,
    });

    const resolveMutation = useMutation({
        mutationFn: ({ bankCode, accountNumber }: { bankCode: string; accountNumber: string }) =>
            payoutService.resolve(bankCode, accountNumber),
    });

    const saveMutation = useMutation({
        mutationFn: ({ bankCode, accountNumber }: { bankCode: string; accountNumber: string }) =>
            payoutService.save(bankCode, accountNumber),
        // Also the tenancy quotes: a tenant who could not pay because there was
        // nowhere to send the money can pay the moment this lands.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payout-account'] });
            queryClient.invalidateQueries({ queryKey: ['tenancy-payment-quote'] });
        },
    });

    return {
        useBanks,
        useMyPayoutAccount,
        resolveAccount: resolveMutation.mutateAsync,
        isResolving: resolveMutation.isPending,
        savePayoutAccount: saveMutation.mutateAsync,
        isSaving: saveMutation.isPending,
    };
};
