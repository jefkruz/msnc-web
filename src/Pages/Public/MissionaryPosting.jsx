import { useForm } from '@inertiajs/react';
import PublicLayout from '../../Components/PublicLayout';
import SearchableSelect from '../../Components/SearchableSelect';
import TitleCaseInput from '../../Components/TitleCaseInput';
import { countryOptions } from '../../data/countries';

const titleOptions = [
    'Pastor',
    'Deacon',
    'Deaconess',
    'Brother',
    'Sister',
    'Evangelist',
    'Doctor',
    'Reverend',
    'Professor',
    'Mr',
    'Mrs',
    'Miss',
].map((title) => ({ value: title, label: title }));

const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
];

const maritalOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
];

const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

const applyPoints = [
    { icon: 'how_to_reg', text: 'Register once, apply at any time.' },
    { icon: 'description', text: 'Upload your credentials securely online.' },
    { icon: 'track_changes', text: 'Track every stage of your application.' },
    { icon: 'event_available', text: 'Be scheduled for an interview when ready.' },
];

const fieldClass =
    'w-full rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark px-3.5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors';
const fieldErrorClass = 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
const labelClass = 'block text-sm font-semibold text-slate-700 dark:text-text-muted mb-1.5';

function Field({ label, error, children, className = '' }) {
    return (
        <div className={className}>
            <label className={labelClass}>{label}</label>
            {children}
            {error && (
                <p className="mt-1.5 text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

function inputClass(hasError) {
    return `${fieldClass}${hasError ? ` ${fieldErrorClass}` : ''}`;
}

export default function MissionaryPosting({ branding = {}, home = {} }) {
    const paragraphs = home.posting_paragraphs?.length
        ? home.posting_paragraphs
        : home.posting_body
          ? [home.posting_body]
          : [];

    const { data, setData, post, processing, errors } = useForm({
        application_statement: false,
        title: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        gender: '',
        country_of_residence: '',
        marital_status: '',
        phone: '',
        dob_month: '',
        dob_day: '',
    });

    const hasFieldErrors = Object.keys(errors).some((key) => key !== 'registration');

    const submit = (e) => {
        e.preventDefault();
        post('/opportunity-to-work-in-ministry/register', {
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout branding={branding} active="opportunity-to-work-in-ministry">
            <section className="page-hero">
                <div className="page-hero__bg" aria-hidden="true">
                    <span className="hero__orb hero__orb--3" />
                    <span className="hero__grid" />
                </div>
                <div className="public-container page-hero__inner" data-stagger>
                    {home.posting_eyebrow && (
                        <span className="eyebrow eyebrow--on-dark" data-reveal>
                            <span className="eyebrow__dot" aria-hidden="true" />
                            {home.posting_eyebrow}
                        </span>
                    )}
                    <h1 data-split data-reveal>
                        {home.posting_title || 'Opportunity to work in ministry'}
                    </h1>
                </div>
            </section>

            <section className="public-section public-section--flush-b">
                <div className="public-container page-content" data-stagger>
                    {paragraphs.map((paragraph, i) => (
                        <p key={i} className={i === 0 ? 'page-content__lead' : undefined} data-reveal>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </section>

            <section className="public-section public-section--flush-t" id="register">
                <div className="public-container posting-layout">
                    <div className="posting-main">
                        <div className="register-card" data-reveal="zoom">
                            <header className="register-card__header">
                                <span className="section-label">Start your application</span>
                                <h2>Registration Form</h2>
                                <p>
                                    Fill in your details below to register with The Mission Support Network
                                    Center. Fields marked with an asterisk are required.
                                </p>
                            </header>

                            {(errors.registration || hasFieldErrors) && (
                                <div className="register-alert register-alert--error" role="alert">
                                    {errors.registration ||
                                        'Please fill in all required fields highlighted below.'}
                                </div>
                            )}

                            <form onSubmit={submit} className="register-form" noValidate>
                                <div className="register-grid">
                                    <Field label="Title" error={errors.title}>
                                        <SearchableSelect
                                            value={data.title}
                                            onChange={(value) => setData('title', value)}
                                            options={titleOptions}
                                            placeholder="Please select"
                                            error={errors.title ? true : undefined}
                                        />
                                    </Field>

                                    <Field label="First name" error={errors.first_name}>
                                        <TitleCaseInput
                                            value={data.first_name}
                                            onChange={(val) => setData('first_name', val)}
                                            className={inputClass(errors.first_name)}
                                            autoComplete="given-name"
                                        />
                                    </Field>

                                    <Field label="Last name" error={errors.last_name}>
                                        <TitleCaseInput
                                            value={data.last_name}
                                            onChange={(val) => setData('last_name', val)}
                                            className={inputClass(errors.last_name)}
                                            autoComplete="family-name"
                                        />
                                    </Field>

                                    <Field label="KingsChat username" error={errors.username}>
                                        <input
                                            type="text"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            className={inputClass(errors.username)}
                                            autoComplete="username"
                                            placeholder="Your KingsChat username"
                                        />
                                    </Field>

                                    <Field label="Email" error={errors.email}>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={inputClass(errors.email)}
                                            autoComplete="email"
                                        />
                                    </Field>

                                    <Field label="Gender" error={errors.gender}>
                                        <SearchableSelect
                                            value={data.gender}
                                            onChange={(value) => setData('gender', value)}
                                            options={genderOptions}
                                            placeholder="Please Select"
                                            error={errors.gender ? true : undefined}
                                        />
                                    </Field>

                                    <Field label="Country of Residence" error={errors.country_of_residence}>
                                        <SearchableSelect
                                            value={data.country_of_residence}
                                            onChange={(value) => setData('country_of_residence', value)}
                                            options={countryOptions}
                                            placeholder="Please select a country"
                                            error={errors.country_of_residence ? true : undefined}
                                        />
                                    </Field>

                                    <Field label="Marital Status" error={errors.marital_status}>
                                        <SearchableSelect
                                            value={data.marital_status}
                                            onChange={(value) => setData('marital_status', value)}
                                            options={maritalOptions}
                                            placeholder="Please select"
                                            error={errors.marital_status ? true : undefined}
                                        />
                                    </Field>

                                    <Field label="Phone Number" error={errors.phone}>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className={inputClass(errors.phone)}
                                            autoComplete="tel"
                                        />
                                    </Field>

                                    <Field
                                        label="Date of Birth"
                                        className="md:col-span-2"
                                        error={errors.dob_month || errors.dob_day}
                                    >
                                        <div className="register-dob">
                                            <SearchableSelect
                                                value={data.dob_month}
                                                onChange={(value) => setData('dob_month', value)}
                                                options={monthOptions}
                                                placeholder="Month"
                                                error={errors.dob_month ? true : undefined}
                                            />
                                            <input
                                                type="number"
                                                min="1"
                                                max="31"
                                                inputMode="numeric"
                                                placeholder="Day"
                                                value={data.dob_day}
                                                onChange={(e) => setData('dob_day', e.target.value)}
                                                className={inputClass(errors.dob_day)}
                                                aria-label="Day of birth"
                                            />
                                        </div>
                                    </Field>
                                </div>

                                <label
                                    className={`register-check register-check--statement${
                                        errors.application_statement ? ' register-check--error' : ''
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.application_statement}
                                        onChange={(e) => setData('application_statement', e.target.checked)}
                                    />
                                    <span>
                                        I apply to register for the opportunity to work in ministry initiative
                                    </span>
                                </label>
                                {errors.application_statement && (
                                    <p className="text-sm text-red-600 -mt-2" role="alert">
                                        {errors.application_statement}
                                    </p>
                                )}

                                <div className="register-actions">
                                    <button
                                        type="submit"
                                        className="btn-mca btn-mca-blue btn-mca-lg btn-mca-arrow lift"
                                        disabled={processing}
                                    >
                                        {processing ? 'Submitting…' : 'Sign Up'}
                                        {!processing && (
                                            <span className="material-symbols-outlined" aria-hidden="true">
                                                arrow_forward
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <aside className="posting-aside" data-reveal="right">
                        <div className="posting-card">
                            <h3>Why apply?</h3>
                            <ul>
                                {applyPoints.map((point) => (
                                    <li key={point.text}>
                                        <span className="material-symbols-outlined" aria-hidden="true">
                                            {point.icon}
                                        </span>
                                        {point.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="posting-card posting-card--navy">
                            <h3>Need help?</h3>
                            <p>Reach out and our team will guide you through the process.</p>
                            <div className="posting-card__contact">
                                <a href="tel:+2348133026781">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        call
                                    </span>
                                    +234 813 302 6781
                                </a>
                                <a href="mailto:info@missionsupportnetworkcenter.org">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        mail
                                    </span>
                                    info@missionsupportnetworkcenter.org
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
}
