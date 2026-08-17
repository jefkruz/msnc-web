export const STAFF_ONLY_DOCUMENT_KEYS = [
    'authorization_recruit_form',
    'terms_of_reference',
];

export const APPLICANT_DOCUMENT_FIELDS = [
    { key: 'cv', label: 'CV', uploadable: true },
    { key: 'foundation_school', label: 'Foundation School Certificate', uploadable: true },
    { key: 'baptismal_certificate', label: 'Baptismal Certificate', uploadable: true },
    { key: 'educational_qualification', label: 'Educational Qualification', uploadable: true },
    { key: 'birth_certificate', label: 'Birth Certificate', uploadable: true },
    { key: 'church_pastor_attestation', label: 'Church Pastor Attestation', uploadable: true },
    { key: 'ministry_referee_attestation', label: 'Ministry Referee Attestation', uploadable: true },
    { key: 'guarantors_letter', label: 'Guarantors Letter', uploadable: true },
    { key: 'ministry_profile', label: 'Ministry Profile', uploadable: true },
    { key: 'application_letter', label: 'Application Letter', uploadable: true },
    { key: 'campus_letter', label: 'Campus Letter', uploadable: true },
    { key: 'others', label: 'Others', uploadable: true },
];

export const STAFF_UPLOAD_DOCUMENT_FIELDS = [
    { key: 'authorization_recruit_form', label: 'Authorization Recruit Form' },
    { key: 'terms_of_reference', label: 'Terms of Reference' },
    ...APPLICANT_DOCUMENT_FIELDS.map(({ key, label }) => ({ key, label })),
];

export function statusBadgeClass(status) {
    return status === 'uploaded'
        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30';
}
