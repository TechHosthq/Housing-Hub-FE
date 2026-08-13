import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import verificationService from '@/services/verificationService';
import { AddDocumentMetadata, StartCaseRequest } from '@/types/verification';

export const useVerification = () => {
    const queryClient = useQueryClient();

    const useMyCases = () => useQuery({
        queryKey: ['verification-cases'],
        queryFn: () => verificationService.getMyCases(),
    });

    const useMyCase = (caseId: string | null) => useQuery({
        queryKey: ['verification-case', caseId],
        queryFn: () => verificationService.getMyCase(caseId!),
        enabled: !!caseId,
    });

    const startCaseMutation = useMutation({
        mutationFn: (data: StartCaseRequest) => verificationService.startCase(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['verification-cases'] });
        },
    });

    const addDocumentMutation = useMutation({
        mutationFn: ({ caseId, metadata, file }: {
            caseId: string; metadata: AddDocumentMetadata; file: File;
        }) => verificationService.addDocument(caseId, metadata, file),
        // Refetch the case rather than appending locally: the server recalculates
        // what is still missing, and that list is what tells the applicant whether
        // they can submit yet.
        onSuccess: (_, { caseId }) => {
            queryClient.invalidateQueries({ queryKey: ['verification-case', caseId] });
        },
    });

    const removeDocumentMutation = useMutation({
        mutationFn: ({ caseId, documentId }: { caseId: string; documentId: string }) =>
            verificationService.removeDocument(caseId, documentId),
        onSuccess: (_, { caseId }) => {
            queryClient.invalidateQueries({ queryKey: ['verification-case', caseId] });
        },
    });

    const submitCaseMutation = useMutation({
        mutationFn: (caseId: string) => verificationService.submitCase(caseId),
        onSuccess: (_, caseId) => {
            queryClient.invalidateQueries({ queryKey: ['verification-case', caseId] });
            queryClient.invalidateQueries({ queryKey: ['verification-cases'] });
        },
    });

    return {
        useMyCases,
        useMyCase,
        startCase: startCaseMutation.mutateAsync,
        isStartingCase: startCaseMutation.isPending,
        addDocument: addDocumentMutation.mutateAsync,
        isAddingDocument: addDocumentMutation.isPending,
        removeDocument: removeDocumentMutation.mutate,
        isRemovingDocument: removeDocumentMutation.isPending,
        submitCase: submitCaseMutation.mutateAsync,
        isSubmittingCase: submitCaseMutation.isPending,
    };
};
