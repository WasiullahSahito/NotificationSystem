import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';
import Pagination from '../ui/Pagination';

const StatusBadge = ({ status }) => {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    const statusClasses = {
        sent: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        failed: 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

export default function NotificationsHistory() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/notifications?page=${currentPage}&limit=10`);
                setNotifications(response.data.notifications);
                setPagination(response.data.pagination);
            } catch (error) {
                toast.error('Failed to fetch notification history.');
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [currentPage]);

    if (loading) return <div className="flex justify-center py-8"><Spinner /></div>;
    if (notifications.length === 0) return <p className="text-center text-gray-500 mt-4">No notifications found.</p>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {notifications.map((notification) => (
                        <tr key={notification._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{notification.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notification.recipient}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <StatusBadge status={notification.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(notification.createdAt).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
}