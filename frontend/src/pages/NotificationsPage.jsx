import SendNotificationForm from '../components/notifications/SendNotificationForm';
import NotificationsHistory from '../components/notifications/NotificationsHistory';

export default function NotificationsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Send Notification</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Send a new Email or SMS notification to one or more recipients.
                </p>
                <div className="mt-6">
                    <SendNotificationForm />
                </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900">Notification History</h2>
                <p className="mt-1 text-sm text-gray-500">
                    View the status of all your sent notifications.
                </p>
                <div className="mt-6">
                    <NotificationsHistory />
                </div>
            </div>
        </div>
    );
}