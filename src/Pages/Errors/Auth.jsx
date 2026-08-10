import ErrorScreen from './ErrorScreen';

export default function AuthError() {
    return (
        <ErrorScreen
            code="auth"
            homeHref="/login/admin"
            homeLabel="Back to sign in"
            showBack={false}
        />
    );
}
