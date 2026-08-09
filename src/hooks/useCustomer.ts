import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import customerService from '@/services/customerService';
import { UpdateProfileRequest, SubmitKycRequest, AddressRequest } from '@/types/customer';
import { useAuthStore } from '@/store/useAuthStore';

export const useCustomer = () => {
    const queryClient = useQueryClient();

    const useGetCustomer = (id: string | null) => useQuery({
        queryKey: ['customer', id],
        queryFn: () => customerService.getCustomer(id!),
        enabled: !!id
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: UpdateProfileRequest) => customerService.updateProfile(data),
        onSuccess: (response) => {
            if (response.isSuccessful) {
                queryClient.invalidateQueries({ queryKey: ['customer', response.data.id] });
            }
        }
    });

    const submitKycMutation = useMutation({
        mutationFn: (data: SubmitKycRequest) => customerService.submitKyc(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] });
        }
    });

    const uploadDocumentMutation = useMutation({
        mutationFn: (file: File) => customerService.uploadKycDocument(file)
    });

    const currentUserId = useAuthStore.getState().user?.id;

    const uploadPhotoMutation = useMutation({
        mutationFn: (file: File) => customerService.uploadProfilePhoto(file),
        onSuccess: () => {
            if (currentUserId) queryClient.invalidateQueries({ queryKey: ['customer', currentUserId] });
        }
    });

    const removePhotoMutation = useMutation({
        mutationFn: () => customerService.removeProfilePhoto(),
        onSuccess: () => {
            if (currentUserId) queryClient.invalidateQueries({ queryKey: ['customer', currentUserId] });
        }
    });

    // Address Hooks
    const useMyAddress = () => useQuery({
        queryKey: ['my-address'],
        queryFn: () => customerService.getMyAddress()
    });

    const updateAddressMutation = useMutation({
        mutationFn: (data: AddressRequest) => customerService.updateAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-address'] });
        }
    });

    return {
        useGetCustomer,
        updateProfile: updateProfileMutation.mutate,
        isUpdatingProfile: updateProfileMutation.isPending,
        submitKyc: submitKycMutation.mutate,
        isSubmittingKyc: submitKycMutation.isPending,
        uploadDocument: uploadDocumentMutation.mutateAsync,
        isUploadingDocument: uploadDocumentMutation.isPending,
        uploadProfilePhoto: uploadPhotoMutation.mutateAsync,
        isUploadingPhoto: uploadPhotoMutation.isPending,
        removeProfilePhoto: removePhotoMutation.mutateAsync,
        isRemovingPhoto: removePhotoMutation.isPending,
        // Address exports
        useMyAddress,
        updateAddress: updateAddressMutation.mutate,
        isUpdatingAddress: updateAddressMutation.isPending,
    };
};
