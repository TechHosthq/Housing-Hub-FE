import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import tenancyService from '@/services/tenancyService';
import { useAuthStore } from '@/store/useAuthStore';

export const useTenancy = () => {
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const useCandidates = (propertyId: string | null) => useQuery({
        queryKey: ['tenancy-candidates', propertyId],
        queryFn: () => tenancyService.getCandidates(propertyId!),
        enabled: !!propertyId && isAuthenticated,
    });

    const useMyTenancies = () => useQuery({
        queryKey: ['tenancies'],
        queryFn: () => tenancyService.getMine(),
        enabled: isAuthenticated,
    });

    /**
     * Invalidated by every mutation below rather than patched.
     *
     * Choosing or releasing somebody changes the listing's availability as well as
     * the tenancy, and the server decides both. Reconstructing that client-side is
     * how the property list ends up disagreeing with the tenancy screen.
     */
    const invalidate = (propertyId?: string) => {
        queryClient.invalidateQueries({ queryKey: ['tenancies'] });
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        queryClient.invalidateQueries({ queryKey: ['my-properties'] });
        if (propertyId) {
            queryClient.invalidateQueries({ queryKey: ['tenancy-candidates', propertyId] });
            queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
        }
    };

    const selectMutation = useMutation({
        mutationFn: ({ propertyId, customerId }: { propertyId: string; customerId: string }) =>
            tenancyService.selectCandidate(propertyId, customerId),
        onSuccess: (_, { propertyId }) => invalidate(propertyId),
    });

    const withdrawMutation = useMutation({
        mutationFn: ({ tenancyId, reason }: { tenancyId: string; reason: string | null }) =>
            tenancyService.withdraw(tenancyId, reason),
        onSuccess: () => invalidate(),
    });

    const declineMutation = useMutation({
        mutationFn: (tenancyId: string) => tenancyService.decline(tenancyId),
        onSuccess: () => invalidate(),
    });

    return {
        useCandidates,
        useMyTenancies,
        selectCandidate: selectMutation.mutateAsync,
        isSelecting: selectMutation.isPending,
        withdrawTenancy: withdrawMutation.mutateAsync,
        isWithdrawing: withdrawMutation.isPending,
        declineTenancy: declineMutation.mutateAsync,
        isDeclining: declineMutation.isPending,
    };
};
