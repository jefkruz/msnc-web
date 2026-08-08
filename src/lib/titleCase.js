const SMALL = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from',
    'in', 'into', 'nor', 'of', 'on', 'onto', 'or', 'the', 'to',
    'vs', 'via', 'with',
]);

const ACRONYMS = new Set(['AMDL', 'MSNC', 'HQ', 'CEO', 'CSO', 'HR', 'IT', 'SDM', 'PIW']);

function cap(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatWord(word, forceCap, singleWord) {
    const upper = word.toLocaleUpperCase();
    if (ACRONYMS.has(upper)) return upper;
    if (singleWord && /^[A-Z0-9]{2,6}$/.test(word)) return word;
    const lower = word.toLocaleLowerCase();
    const mc = lower.match(/^(mc)([a-z].+)$/);
    if (mc) return `Mc${cap(mc[2])}`;
    if (!forceCap && SMALL.has(lower)) return lower;
    const apostrophe = lower.match(/^([a-z]+)'([a-z].+)$/);
    if (apostrophe) return `${cap(apostrophe[1])}'${cap(apostrophe[2])}`;
    return cap(lower);
}

/** Title-case names, departments, ranks, and similar phrases. */
export function titleCase(value) {
    const text = String(value ?? '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    const parts = text.split(/(\s+|[-–—/])/);
    const wordCount = parts.filter((p) => p && !/^[\s\-–—/]+$/.test(p)).length;
    let index = 0;
    return parts.map((part) => {
        if (!part || /^[\s\-–—/]+$/.test(part)) return part;
        const forceCap = index === 0 || index === wordCount - 1;
        index += 1;
        return formatWord(part, forceCap, wordCount === 1);
    }).join('');
}

export function titleCaseLabel(opt) {
    const raw = opt?.name ?? opt?.label ?? (opt == null ? '' : String(opt));
    return titleCase(raw);
}
