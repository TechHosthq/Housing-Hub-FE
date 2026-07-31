"use client";

// Browsers block HTMLMediaElement.play() calls that aren't the direct result of
// a user gesture, and a SignalR push notification never is. A single shared
// element gets "unlocked" by playing (and immediately pausing) it on the
// page's first genuine user interaction, after which the browser permits
// programmatic playback on that same element for the rest of the session.
let sharedAudio: HTMLAudioElement | null = null;
let isUnlocked = false;

function getSharedAudio(): HTMLAudioElement {
    if (!sharedAudio) {
        sharedAudio = new Audio("/sounds/notification.wav");
    }
    return sharedAudio;
}

function unlock() {
    if (isUnlocked) return;
    const audio = getSharedAudio();
    audio
        .play()
        .then(() => {
            audio.pause();
            audio.currentTime = 0;
            isUnlocked = true;
        })
        .catch(() => {
            // Still locked; the next real interaction will retry.
        });
}

export function registerNotificationAudioUnlock() {
    if (typeof window === "undefined" || isUnlocked) return () => {};

    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown"];
    events.forEach((event) => window.addEventListener(event, unlock, { once: true }));

    return () => {
        events.forEach((event) => window.removeEventListener(event, unlock));
    };
}

export function playNotificationAudio() {
    const audio = getSharedAudio();
    audio.currentTime = 0;
    audio.play().catch((err) => {
        console.warn("Notification sound blocked by the browser:", err);
    });
}
