import { CustomerType } from '@/types/auth';
import {
    VerificationDocumentType as DocType,
    VerificationSubjectType,
} from '@/types/verification';

/**
 * Which documents to ask each kind of applicant for, and how to explain them.
 *
 * Kept as data in one place because this is the part most likely to change —
 * LASRERA is Lagos-only, ESVARBON applies only to practising estate surveyors,
 * and adding a state means adding rows here rather than editing a form.
 *
 * `required` mirrors what the server will actually enforce on submit. Everything
 * else strengthens the case without blocking it, which is deliberate: demanding
 * the full set up front stalls every applicant on whichever document is hardest
 * to obtain, and in this market that is usually the tax clearance.
 */

export interface DocumentPrompt {
    type: DocType;
    label: string;
    /** Why we are asking, in the applicant's terms. */
    help: string;
    required: boolean;
    /** Prompt for the registration number printed on it, e.g. an RC number. */
    numberLabel?: string;
    /** Ask when it expires. Only for documents that actually lapse. */
    asksExpiry?: boolean;
}

const CAC_CERTIFICATE: DocumentPrompt = {
    type: DocType.CacCertificate,
    label: 'CAC certificate of incorporation',
    help:
        'The certificate showing your RC or BN number. This is the one document we '
        + 'cannot verify you without — everything else supports it.',
    required: true,
    numberLabel: 'RC or BN number',
};

const BUSINESS_SUPPORTING: DocumentPrompt[] = [
    {
        type: DocType.CacStatusReport,
        label: 'CAC status report',
        help: 'Confirms the company is still active and lists its directors.',
        required: false,
    },
    {
        type: DocType.LasreraPermit,
        label: 'LASRERA registration',
        help:
            'Required if you operate in Lagos. These lapse annually, so tell us the '
            + 'expiry date and we will remind you before it does.',
        required: false,
        numberLabel: 'LASRERA number',
        asksExpiry: true,
    },
    {
        type: DocType.EsvarbonLicence,
        label: 'ESVARBON registration',
        help: 'Only if you practise as an estate surveyor and valuer.',
        required: false,
        numberLabel: 'ESVARBON number',
        asksExpiry: true,
    },
    {
        type: DocType.NiesvMembership,
        label: 'NIESV membership',
        help: 'Optional. Strengthens your profile if you are a member.',
        required: false,
        asksExpiry: true,
    },
    {
        type: DocType.TaxClearance,
        label: 'Tax clearance certificate',
        help: 'Optional, and we know it is slow to obtain. Add it whenever you have it.',
        required: false,
        asksExpiry: true,
    },
    {
        type: DocType.ProofOfAddress,
        label: 'Proof of business address',
        help: 'A utility bill for your office, dated within the last three months.',
        required: false,
    },
];

const DEVELOPER_EXTRAS: DocumentPrompt[] = [
    {
        type: DocType.PlanningPermit,
        label: 'Planning permit',
        help: 'For developers — the approval covering the development you are marketing.',
        required: false,
    },
    {
        type: DocType.CertificateOfCompletion,
        label: 'Certificate of completion',
        help: 'For completed developments.',
        required: false,
    },
];

const TITLE_DOCUMENTS: DocumentPrompt[] = [
    {
        type: DocType.CertificateOfOccupancy,
        label: 'Certificate of Occupancy',
        help:
            'The C of O for this property. If you acquired it by transfer rather than '
            + 'directly from the state, upload the Deed of Assignment instead — either '
            + 'one is enough.',
        required: true,
        numberLabel: 'C of O number',
    },
    {
        type: DocType.DeedOfAssignment,
        label: 'Deed of Assignment',
        help: 'Use this if you acquired the property by transfer. An alternative to the C of O.',
        required: false,
    },
    {
        type: DocType.GovernorsConsent,
        label: "Governor's Consent",
        help: 'Required for a transfer to be valid. Upload it if you have it.',
        required: false,
    },
    {
        type: DocType.SurveyPlan,
        label: 'Survey plan',
        help: 'Confirms the boundaries of the land.',
        required: false,
    },
    {
        type: DocType.LetterOfAuthorityToLet,
        label: 'Letter of authority to let',
        help:
            'Required if the property is not in your own name — for example if you are '
            + 'acting for the owner. Written permission from whoever is named on the title.',
        required: false,
    },
];

/**
 * The document list for a given case.
 *
 * Developers get the build documents on top of the standard business set;
 * everyone else asking for business verification gets the standard set.
 */
export function promptsFor(
    subjectType: VerificationSubjectType,
    customerType?: CustomerType,
): DocumentPrompt[] {
    if (subjectType === VerificationSubjectType.Property) return TITLE_DOCUMENTS;

    const base = [CAC_CERTIFICATE, ...BUSINESS_SUPPORTING];

    return customerType === CustomerType.Developer
        ? [...base, ...DEVELOPER_EXTRAS]
        : base;
}

export function promptFor(
    documentType: DocType,
    subjectType: VerificationSubjectType,
    customerType?: CustomerType,
): DocumentPrompt | undefined {
    return promptsFor(subjectType, customerType).find((p) => p.type === documentType);
}

/**
 * Whether this account type is a business at all.
 *
 * Owners are not businesses — they own a property, and there is no company to
 * verify. Offering them a CAC upload would be asking for something that does not
 * exist, so the hub hides business verification from them entirely.
 */
export function isBusinessAccount(customerType?: CustomerType): boolean {
    return customerType === CustomerType.Agent || customerType === CustomerType.Developer;
}
