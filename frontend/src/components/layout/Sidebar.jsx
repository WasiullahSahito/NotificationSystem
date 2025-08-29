import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineBell,
    HiOutlineTemplate,
    HiX,
} from 'react-icons/hi';

const navigation = [
    { name: 'Dashboard', href: '/', icon: HiOutlineHome },
    { name: 'Notifications', href: '/notifications', icon: HiOutlineBell },
    { name: 'Templates', href: '/templates', icon: HiOutlineTemplate },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    return (
        <>
            {/* Mobile sidebar overlay */}
            <div
                className={`fixed inset-0 z-30 bg-gray-900 bg-opacity-75 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col bg-gray-800 text-white transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 lg:justify-center">
                    <h1 className="text-xl font-bold">Notifier</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-400 hover:text-white lg:hidden"
                    >
                        <HiX className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1 p-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            end={item.href === '/'}
                            className={({ isActive }) =>
                                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    );
}