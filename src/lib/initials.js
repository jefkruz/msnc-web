export function initialsFromName(name = '') {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'U';
    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('');
}

export function toneFromName(name = '') {
    let hash = 0;
    for (const char of String(name)) {
        hash = (hash + char.charCodeAt(0)) % 6;
    }
    return hash;
}
