export const SOURCE_PUBLIC = 'public';
export const SOURCE_STAFF = 'staff';

export function applicantSourceLabel(source) {
    if (source === SOURCE_PUBLIC) return 'Self registration';
    if (source === SOURCE_STAFF) return 'Added by staff';
    return 'Added by staff';
}

export function applicantSourceFromRecord(applicant) {
    if (applicant?.registration_source === SOURCE_PUBLIC || applicant?.source === SOURCE_PUBLIC) {
        return SOURCE_PUBLIC;
    }
    return SOURCE_STAFF;
}

export function applicantSourceBadgeClass(source) {
    return source === SOURCE_PUBLIC ? 'badge badge-info' : 'badge badge-secondary';
}
