import { Navigate, useLocation } from 'react-router-dom';

export default function ApplicantsRedirect() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    const target = source === 'public'
        ? '/administrator/applicants/self-registration'
        : '/administrator/applicants/staff';

    params.delete('source');
    const rest = params.toString();

    return <Navigate to={`${target}${rest ? `?${rest}` : ''}`} replace />;
}
