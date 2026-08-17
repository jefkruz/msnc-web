export const BIODATA_SECTIONS = [
    {
        id: 'personal',
        label: 'Personal',
        icon: 'person',
        description: 'Family and identity details',
    },
    {
        id: 'faith',
        label: 'Faith',
        icon: 'church',
        description: 'Christian experience and church membership',
    },
    {
        id: 'referees',
        label: 'Referees',
        icon: 'contacts',
        description: 'Two referees who can vouch for you',
    },
    {
        id: 'work',
        label: 'Work history',
        icon: 'work_history',
        description: 'Employment record in chronological order',
    },
    {
        id: 'cv',
        label: 'CV',
        icon: 'upload_file',
        description: 'Upload your curriculum vitae',
    },
];

function hasText(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
}

function workEntryComplete(entry) {
    return hasText(entry?.organisation) && hasText(entry?.designation);
}

export function isBiodataSectionComplete(sectionId, data, applicant = {}) {
    switch (sectionId) {
        case 'personal':
            return hasText(data.marital_status) && hasText(data.gender);

        case 'faith':
            if (data.is_christian === null || data.is_christian === undefined || data.is_christian === '') {
                return false;
            }
            if (data.is_christian === false || data.is_christian === '0' || data.is_christian === 0) {
                return true;
            }
            return (
                hasText(data.born_again_when)
                && hasText(data.born_again_where)
                && hasText(data.holy_spirit_when)
                && hasText(data.holy_spirit_where)
                && hasText(data.joined_lw_when)
                && hasText(data.joined_lw_where)
                && hasText(data.current_assembly)
                && hasText(data.current_assembly_date_joined)
                && hasText(data.baptized_when_where)
                && hasText(data.foundation_school_when_where)
            );

        case 'referees':
            return (
                hasText(data.referee1_name)
                && hasText(data.referee1_contact)
                && hasText(data.referee2_name)
                && hasText(data.referee2_contact)
            );

        case 'work': {
            const entries = Array.isArray(data.work_history) ? data.work_history : [];
            return entries.some(workEntryComplete);
        }

        case 'cv':
            return Boolean(applicant?.cv_url || data.cv);

        default:
            return false;
    }
}

export function biodataSectionStatuses(data, applicant = {}) {
    return BIODATA_SECTIONS.map((section, index) => {
        const complete = isBiodataSectionComplete(section.id, data, applicant);
        const previousComplete = index === 0
            || isBiodataSectionComplete(BIODATA_SECTIONS[index - 1].id, data, applicant);

        return {
            ...section,
            complete,
            accessible: index === 0 || previousComplete || complete,
        };
    });
}

export function firstIncompleteSectionId(data, applicant = {}) {
    const statuses = biodataSectionStatuses(data, applicant);
    const next = statuses.find((section) => !section.complete);
    return next?.id ?? statuses[statuses.length - 1].id;
}

export function nextSectionId(currentId) {
    const index = BIODATA_SECTIONS.findIndex((section) => section.id === currentId);
    if (index < 0 || index >= BIODATA_SECTIONS.length - 1) {
        return null;
    }
    return BIODATA_SECTIONS[index + 1].id;
}

export function previousSectionId(currentId) {
    const index = BIODATA_SECTIONS.findIndex((section) => section.id === currentId);
    if (index <= 0) {
        return null;
    }
    return BIODATA_SECTIONS[index - 1].id;
}

export function sectionValidationErrors(sectionId, data, applicant = {}) {
    const errors = {};

    switch (sectionId) {
        case 'personal':
            if (!hasText(data.marital_status)) errors.marital_status = 'Marital status is required.';
            if (!hasText(data.gender)) errors.gender = 'Gender is required.';
            break;

        case 'faith':
            if (data.is_christian === null || data.is_christian === undefined || data.is_christian === '') {
                errors.is_christian = 'Please indicate if you are a Christian.';
                break;
            }
            if (data.is_christian === true || data.is_christian === '1' || data.is_christian === 1) {
                if (!hasText(data.born_again_when)) errors.born_again_when = 'Required.';
                if (!hasText(data.born_again_where)) errors.born_again_where = 'Required.';
                if (!hasText(data.holy_spirit_when)) errors.holy_spirit_when = 'Required.';
                if (!hasText(data.holy_spirit_where)) errors.holy_spirit_where = 'Required.';
                if (!hasText(data.joined_lw_when)) errors.joined_lw_when = 'Required.';
                if (!hasText(data.joined_lw_where)) errors.joined_lw_where = 'Required.';
                if (!hasText(data.current_assembly)) errors.current_assembly = 'Required.';
                if (!hasText(data.current_assembly_date_joined)) errors.current_assembly_date_joined = 'Required.';
                if (!hasText(data.baptized_when_where)) errors.baptized_when_where = 'Required.';
                if (!hasText(data.foundation_school_when_where)) errors.foundation_school_when_where = 'Required.';
            }
            break;

        case 'referees':
            if (!hasText(data.referee1_name)) errors.referee1_name = 'Referee 1 name is required.';
            if (!hasText(data.referee1_contact)) errors.referee1_contact = 'Referee 1 contact is required.';
            if (!hasText(data.referee2_name)) errors.referee2_name = 'Referee 2 name is required.';
            if (!hasText(data.referee2_contact)) errors.referee2_contact = 'Referee 2 contact is required.';
            break;

        case 'work': {
            const entries = Array.isArray(data.work_history) ? data.work_history : [];
            if (!entries.some(workEntryComplete)) {
                errors.work_history = 'Add at least one work entry with organisation and designation.';
            }
            break;
        }

        case 'cv':
            if (!applicant?.cv_url && !data.cv) {
                errors.cv = 'Please upload your CV to continue.';
            }
            break;

        default:
            break;
    }

    return errors;
}
