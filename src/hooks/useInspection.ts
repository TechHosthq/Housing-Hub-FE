"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import inspectionService from '@/services/inspectionService';
import { 
    CreateInspectionRequest, 
    RespondToInspectionRequest, 
    RescheduleInspectionRequest 
} from '@/types/inspection';

export const useInspection = () => {
    const queryClient = useQueryClient();

    const useGetInspection = (id: string | null) => useQuery({
        queryKey: ['inspection', id],
        queryFn: () => inspectionService.getInspection(id!),
        enabled: !!id
    });

    const useMyInspections = (pageNumber: number = 1, pageSize: number = 10, status?: number) => useQuery({
        queryKey: ['my-inspections', pageNumber, pageSize, status],
        queryFn: () => inspectionService.getMyInspections(pageNumber, pageSize, status)
    });

    const useOwnerInspections = (pageNumber: number = 1, pageSize: number = 10, status?: number) => useQuery({
        queryKey: ['owner-inspections', pageNumber, pageSize, status],
        queryFn: () => inspectionService.getOwnerInspections(pageNumber, pageSize, status)
    });

    const usePropertyInspections = (propertyId: string | null, pageNumber: number = 1, pageSize: number = 10, status?: number) => useQuery({
        queryKey: ['property-inspections', propertyId, pageNumber, pageSize, status],
        queryFn: () => inspectionService.getInspectionsByProperty(propertyId!, pageNumber, pageSize, status),
        enabled: !!propertyId
    });

    const createInspectionMutation = useMutation({
        mutationFn: (data: CreateInspectionRequest) => inspectionService.createInspection(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-inspections'] });
        }
    });

    const respondToInspectionMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: RespondToInspectionRequest }) => 
            inspectionService.respondToInspection(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['inspection', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['owner-inspections'] });
            queryClient.invalidateQueries({ queryKey: ['my-inspections'] });
            queryClient.invalidateQueries({ queryKey: ['property-inspections'] });
        }
    });

    const rescheduleMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: RescheduleInspectionRequest }) => 
            inspectionService.rescheduleInspection(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['inspection', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['my-inspections'] });
            queryClient.invalidateQueries({ queryKey: ['owner-inspections'] });
        }
    });

    const respondToRescheduleMutation = useMutation({
        mutationFn: ({ id, accept }: { id: string, accept: boolean }) => 
            inspectionService.respondToReschedule(id, accept),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['inspection', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['my-inspections'] });
            queryClient.invalidateQueries({ queryKey: ['owner-inspections'] });
        }
    });

    return {
        useGetInspection,
        useMyInspections,
        useOwnerInspections,
        usePropertyInspections,
        createInspection: createInspectionMutation.mutate,
        isCreatingInspection: createInspectionMutation.isPending,
        respondToInspection: respondToInspectionMutation.mutate,
        isResponding: respondToInspectionMutation.isPending,
        reschedule: rescheduleMutation.mutate,
        isRescheduling: rescheduleMutation.isPending,
        respondToReschedule: respondToRescheduleMutation.mutate,
        isRespondingToReschedule: respondToRescheduleMutation.isPending,
    };
};
