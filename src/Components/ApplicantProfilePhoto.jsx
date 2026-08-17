import { useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import UserAvatar from './UserAvatar';

const fileInputClass =
    'w-full rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-2 text-sm text-slate-900 dark:text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:font-medium';

export default function ApplicantProfilePhoto({ photoUrl = null, className = '' }) {
    const { auth } = usePage().props || {};
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const displayUrl = preview || photoUrl || auth?.image || null;
    const displayName = auth?.name || 'Applicant';

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] ?? null;
        setError('');

        if (!file) {
            setPreview(null);
            return;
        }

        if (!/^image\//.test(file.type)) {
            setError('Please choose a JPG, PNG, or WEBP image.');
            setPreview(null);
            return;
        }

        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = () => {
        const file = inputRef.current?.files?.[0];
        if (!file) {
            setError('Choose a photo to upload.');
            return;
        }

        setProcessing(true);
        setError('');

        router.post('/applicant/profile-photo', { photo: file }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPreview(null);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            },
            onError: (errors) => {
                setError(errors.photo || 'Unable to upload profile photo.');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className={`bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm ${className}`.trim()}>
            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-white/5">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">account_circle</span>
                    Profile photo
                </h3>
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <UserAvatar name={displayName} src={displayUrl} size="xl" className="border-2 border-slate-200 dark:border-border-dark" />
                </div>
                <div className="flex-1 space-y-3">
                    <p className="text-sm text-slate-500 dark:text-text-muted">
                        Upload a clear photo of yourself. This appears in the portal sidebar and on your application profile.
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className={fileInputClass}
                    />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-lg">upload</span>
                        {processing ? 'Uploading…' : 'Update photo'}
                    </button>
                </div>
            </div>
        </div>
    );
}
