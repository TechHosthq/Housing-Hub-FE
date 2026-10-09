import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import tenancyService from '@/services/tenancyService';
import { useAuthStore } from '@/store/useAuthStore';
import { TenancyFeeInput } from '@/types/tenancy';

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

    const useTenancyDetail = (tenancyId: string | null) => useQuery({
        queryKey: ['tenancy', tenancyId],
        queryFn: () => tenancyService.getById(tenancyId!),
        enabled: !!tenancyId && isAuthenticated,
    });

    /**
     * The documents, the fees and the total, as one query.
     *
     * Never updated by hand after a mutation. The server decides what a submission
     * did to the document's status, whether the pack is now complete and whether
     * completing it advanced the tenancy — all three are derived, and rebuilding
     * them here is how the screen comes to disagree with the server about whether
     * somebody still owes a document.
     */
    const useDocumentPack = (tenancyId: string | null) => useQuery({
        queryKey: ['tenancy-pack', tenancyId],
        queryFn: () => tenancyService.getDocumentPack(tenancyId!),
        enabled: !!tenancyId && isAuthenticated,
    });

    /**
     * Invalidated by every mutation below rather than patched.
     *
     * Choosing or releasing somebody changes the listing's availability as well as
     * the tenancy, and the server decides both. Reconstructing that client-side is
     * how the property list ends up disagreeing with the tenancy screen.
     */
    const invalidatePack = (tenancyId: string) => {
        queryClient.invalidateQueries({ queryKey: ['tenancy-pack', tenancyId] });
        // Accepting the last document moves the tenancy on, so the tenancy itself
        // and the lists that show its status are stale too.
        queryClient.invalidateQueries({ queryKey: ['tenancy', tenancyId] });
        queryClient.invalidateQueries({ queryKey: ['tenancies'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

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

    const addDocumentMutation = useMutation({
        mutationFn: ({ tenancyId, document, file }: {
            tenancyId: string;
            document: Parameters<typeof tenancyService.addDocument>[1];
            file?: File | null;
        }) => tenancyService.addDocument(tenancyId, document, file),
        onSuccess: (_, { tenancyId }) => invalidatePack(tenancyId),
    });

    const removeDocumentMutation = useMutation({
        mutationFn: ({ tenancyId, documentId }: { tenancyId: string; documentId: string }) =>
            tenancyService.removeDocument(tenancyId, documentId),
        onSuccess: (_, { tenancyId }) => invalidatePack(tenancyId),
    });

    const setFeesMutation = useMutation({
        mutationFn: ({ tenancyId, fees }: { tenancyId: string; fees: TenancyFeeInput[] }) =>
            tenancyService.setFees(tenancyId, fees),
        onSuccess: (_, { tenancyId }) => invalidatePack(tenancyId),
    });

    const sendDocumentsMutation = useMutation({
        mutationFn: (tenancyId: string) => tenancyService.sendDocuments(tenancyId),
        onSuccess: (_, tenancyId) => invalidatePack(tenancyId),
    });

    const submitDocumentMutation = useMutation({
        mutationFn: ({ tenancyId, documentId, file }: {
            tenancyId: string; documentId: string; file: File;
        }) => tenancyService.submitDocument(tenancyId, documentId, file),
        onSuccess: (_, { tenancyId }) => invalidatePack(tenancyId),
    });

    const signDocumentMutation = useMutation({
        mutationFn: ({ tenancyId, documentId }: { tenancyId: string; documentId: string }) =>
            tenancyService.signDocument(tenancyId, documentId),
        onSuccess: (_, { tenancyId }) => invalidatePack(tenancyId),
    });

    const reviewDocumentMutation = useMutation({
        mutationFn: ({ tenancyId, documentId, accept, rejectionReason }: {
            tenancyId: string; documentId: string; accept: boolean; rejectionReason?: string | null;
        }) => tenancyService.reviewDocument(tenancyId, documentId, accept, rejectionReason),
        onSuccess: (_, { tenancyId }) => invalidatePack(tenancyId),
    });

    /**
     * Not a query, deliberately.
     *
     * The link is short-lived and is itself the credential — caching it under a
     * query key would keep a readable URL to somebody's tenancy agreement in memory
     * long after it stopped working. Call it on click, use it, drop it.
     */
    const fetchDocumentUrl = (tenancyId: string, documentId: string, submitted: boolean) =>
        tenancyService.getDocumentUrl(tenancyId, documentId, submitted);

    return {
        useCandidates,
        useMyTenancies,
        useTenancyDetail,
        useDocumentPack,
        fetchDocumentUrl,
        addDocument: addDocumentMutation.mutateAsync,
        isAddingDocument: addDocumentMutation.isPending,
        removeDocument: removeDocumentMutation.mutateAsync,
        isRemovingDocument: removeDocumentMutation.isPending,
        setFees: setFeesMutation.mutateAsync,
        isSettingFees: setFeesMutation.isPending,
        sendDocuments: sendDocumentsMutation.mutateAsync,
        isSendingDocuments: sendDocumentsMutation.isPending,
        submitDocument: submitDocumentMutation.mutateAsync,
        isSubmittingDocument: submitDocumentMutation.isPending,
        signDocument: signDocumentMutation.mutateAsync,
        isSigningDocument: signDocumentMutation.isPending,
        reviewDocument: reviewDocumentMutation.mutateAsync,
        isReviewingDocument: reviewDocumentMutation.isPending,
        selectCandidate: selectMutation.mutateAsync,
        isSelecting: selectMutation.isPending,
        withdrawTenancy: withdrawMutation.mutateAsync,
        isWithdrawing: withdrawMutation.isPending,
        declineTenancy: declineMutation.mutateAsync,
        isDeclining: declineMutation.isPending,
    };
};
