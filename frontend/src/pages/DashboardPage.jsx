import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { HiOutlineBell, HiOutlineTemplate } from 'react-icons/hi';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
            <p className="mt-2 text-gray-600">Manage your notifications and templates from here.</p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link to="/notifications" className="transform rounded-lg bg-white p-6 shadow transition hover:scale-105">
                    <div className="flex items-center">
                        <div className="rounded-md bg-blue-100 p-3">
                            <HiOutlineBell className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg font-semibold text-gray-900">Send Notification</p>
                            <p className="text-sm text-gray-500">Send Email or SMS</p>
                        </div>
                    </div>
                </Link>

                <Link to="/templates" className="transform rounded-lg bg-white p-6 shadow transition hover:scale-105">
                    <div className="flex items-center">
                        <div className="rounded-md bg-green-100 p-3">
                            <HiOutlineTemplate className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg font-semibold text-gray-900">Manage Templates</p>
                            <p className="text-sm text-gray-500">Create and edit templates</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}