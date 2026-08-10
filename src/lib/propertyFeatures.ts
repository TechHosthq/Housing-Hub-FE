/**
 * Property amenities.
 *
 * Mirrors the `[Flags] enum PropertyFeature` on the backend — the API stores the
 * selected amenities as a single bitmask integer, so the values must stay in sync.
 */
export enum PropertyFeature {
    None = 0,
    Parking = 1,
    SwimmingPool = 2,
    Garden = 4,
    Gym = 8,
    Security = 16,
    Furnished = 32,
    AirConditioning = 64,
    Balcony = 128,
    CCTV = 256,
    Elevator = 512,
    BackupGenerator = 1024,
    BoreholeWater = 2048,
    Serviced = 4096,
    PetFriendly = 8192,
}

export const PROPERTY_FEATURE_LABELS: Record<number, string> = {
    [PropertyFeature.Parking]: "Parking",
    [PropertyFeature.SwimmingPool]: "Swimming Pool",
    [PropertyFeature.Garden]: "Garden",
    [PropertyFeature.Gym]: "Gym",
    [PropertyFeature.Security]: "24/7 Security",
    [PropertyFeature.Furnished]: "Furnished",
    [PropertyFeature.AirConditioning]: "Air Conditioning",
    [PropertyFeature.Balcony]: "Balcony",
    [PropertyFeature.CCTV]: "CCTV",
    [PropertyFeature.Elevator]: "Elevator",
    [PropertyFeature.BackupGenerator]: "Backup Generator",
    [PropertyFeature.BoreholeWater]: "Borehole Water",
    [PropertyFeature.Serviced]: "Serviced",
    [PropertyFeature.PetFriendly]: "Pet Friendly",
};

/**
 * Expands the bitmask into the amenity labels actually set on a property.
 *
 * The property page previously rendered a fixed list — "Internet", "Parking",
 * "Prepaid meter" — on every listing regardless of what the owner selected, so the
 * amenities shown had no relationship to the property.
 */
export function decodePropertyFeatures(features: number | null | undefined): string[] {
    if (!features) return [];

    return Object.entries(PROPERTY_FEATURE_LABELS)
        .filter(([bit]) => (features & Number(bit)) !== 0)
        .map(([, label]) => label);
}
