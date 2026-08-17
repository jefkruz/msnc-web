import { initialsFromName, toneFromName } from '../lib/initials';

export default function UserAvatar({
    name = '',
    src = null,
    size = 'md',
    tone,
    variant = 'circle',
    className = '',
}) {
    const toneClass = `user-avatar--tone-${tone ?? toneFromName(name)}`;
    const sizeClass = size ? `user-avatar--${size}` : '';
    const variantClass = variant === 'rounded' ? 'user-avatar--rounded' : variant === 'passport' ? 'user-avatar--passport' : '';

    return (
        <span className={['user-avatar', sizeClass, toneClass, variantClass, className].filter(Boolean).join(' ')}>
            {!src ? <span className="user-avatar__initials">{initialsFromName(name)}</span> : null}
            {src ? <img src={src} alt="" /> : null}
        </span>
    );
}
