import PublicLayout from './PublicLayout';

export default function GuestLayout({ title, children, appName = 'Recruitment Portal' }) {
    return (
        <PublicLayout active="">
            <div className="public-container">
                <div className="guest-card">
                    <div className="guest-card__head">
                        <span className="guest-card__mark">
                            <span className="material-symbols-outlined">work</span>
                        </span>
                        <h1>{appName}</h1>
                    </div>
                    <div className="guest-card__body">
                        <h2>{title}</h2>
                        {children}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
