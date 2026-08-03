"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import propertyAlertService from '@/services/propertyAlertService';
import { CreatePropertyAlertPreferenceRequest } from '@/types/propertyAlert';

export const usePropertyAlert = () => {
    const queryClient = useQueryClient();

    const useMyPreferences = () => useQuery({
        queryKey: ['property-alert-preferences'],
        queryFn: () => propertyAlertService.getMine()
    });

    const createPreferenceMutation = useMutation({
        mutationFn: (data: CreatePropertyAlertPreferenceRequest) => propertyAlertService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property-alert-preferences'] });
        }
    });

    const deletePreferenceMutation = useMutation({
        mutationFn: (id: string) => propertyAlertService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property-alert-preferences'] });
        }
    });

    return {
        useMyPreferences,
        createPreference: createPreferenceMutation.mutate,
        isCreatingPreference: createPreferenceMutation.isPending,
        deletePreference: deletePreferenceMutation.mutate,
        isDeletingPreference: deletePreferenceMutation.isPending,
    };
};
