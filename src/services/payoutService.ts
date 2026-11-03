import apiClient from './apiClient';
import {
    BanksResponse,
    PayoutAccountResponse,
    ResolvedAccountResponse,
} from '@/types/payout';

/**
 * Where an owner's rent is paid out to.
 *
 * Every call acts on the caller's own account and sends no customer id — there is
 * no route by which one person can read or set another's.
 */
const payoutService = {
    getBanks: async (): Promise<BanksResponse> => {
        const response = await apiClient.get('/api/v1/PayoutAccount/banks');
        return response.data;
    },

    getMine: async (): Promise<PayoutAccountResponse> => {
        const response = await apiClient.get('/api/v1/PayoutAccount/mine');
        return response.data;
    },

    /**
     * Asks the bank whose account this is, creating nothing.
     *
     * So the owner sees the name before committing to it — a mistyped digit should
     * read as the wrong name, not as a refusal to guess at.
     */
    resolve: async (bankCode: string, accountNumber: string): Promise<ResolvedAccountResponse> => {
        const response = await apiClient.post(
            '/api/v1/PayoutAccount/resolve',
            { bankCode, accountNumber },
            { skipErrorToast: true },
        );
        return response.data;
    },

    save: async (bankCode: string, accountNumber: string): Promise<PayoutAccountResponse> => {
        const response = await apiClient.put(
            '/api/v1/PayoutAccount',
            { bankCode, accountNumber },
            { skipErrorToast: true },
        );
        return response.data;
    },
};

export default payoutService;
