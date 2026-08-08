import ErrorScreen from './ErrorScreen';

export default function ServerError() {
    return <ErrorScreen code="500" showRetry showBack={false} />;
}
