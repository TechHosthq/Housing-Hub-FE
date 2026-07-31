import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface NotificationSoundState {
    isSoundEnabled: boolean;
    toggleSound: () => void;
    setSoundEnabled: (value: boolean) => void;
}

export const useNotificationSoundStore = create<NotificationSoundState>()(
    persist(
        (set) => ({
            isSoundEnabled: true,
            toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
            setSoundEnabled: (value) => set({ isSoundEnabled: value }),
        }),
        {
            name: 'notification-sound-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
