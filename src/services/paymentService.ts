import apiClient from './apiClient';
import { PaymentQuoteResponse, PaymentResponse, PaymentsResponse } from '@/types/payment';

/**
 * Paying fees owed to Housing Hub.
 *
 * Note what is absent: nothing here sends an amount. Prices are computed by the
 * server from configuration, and a client that could name its own price would be
 * a client that could set it to zero.
 */
const paymentService = {
    /**
     * What a verification request costs.
     *
     * Call this before showing any price. Read `isPaymentRequired` first — when
     * charging is switched off it is false and every figure is zero, which is not
     * the same thing as a failed lookup.
     */
    quoteVerificationCase: async (caseId: string): Promise<PaymentQuoteResponse> => {
        const response = await apiClient.get(
            `/api/v1/Payment/verification-cases/${caseId}/quote`,
        );
        return response.data;
    },

    /**
     * Starts a payment and returns where to send the payer.
     *
     * Safe to call twice — the server hands back the attempt already in flight
     * rather than registering a second charge, so a double-clicked button is not a
     * double payment.
     *
     * `callbackUrl` must be on an origin the API already trusts (its CORS list) or
     * it is dropped: unchecked, it would be an open redirect at the moment the
     * payer expects a receipt.
     */
    initialiseVerificationPayment: async (
        caseId: string, callbackUrl?: string,
    ): Promise<PaymentResponse> => {
        const response = await apiClient.post(
            `/api/v1/Payment/verification-cases/${caseId}`,
            { callbackUrl: callbackUrl ?? null },
        );
        return response.data;
    },

    /**
     * The current state of one of your payments.
     *
     * The authority the return page polls. Arriving back from the gateway proves
     * nothing on its own — the payer controls that redirect — so the client asks
     * the server, which only reports Paid once the provider's signed webhook has
     * settled it.
     */
    getByReference: async (reference: string): Promise<PaymentResponse> => {
        const response = await apiClient.get(`/api/v1/Payment/${reference}`);
        return response.data;
    },

    getMine: async (): Promise<PaymentsResponse> => {
        const response = await apiClient.get('/api/v1/Payment/mine');
        return response.data;
    },
};

export default paymentService;
