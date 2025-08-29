import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { HiMenuAlt2, HiOutlineLogout, HiUserCircle } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar({ setSidebarOpen }) {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
            <button
                type="button"
                className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                onClick={() => setSidebarOpen(true)}
            >
                <HiMenuAlt2 className="h-6 w-6" />
            </button>
            <div className="flex flex-1 justify-end">
                <Menu as="div" className="relative">
                    <div>
                        <Menu.Button className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <span className="sr-only">Open user menu</span>
                            <HiUserCircle className="h-8 w-8 text-gray-600" />
                            <span className="ml-2 hidden text-gray-700 md:block">{user?.username || 'User'}</span>
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                <button
                                    onClick={logout}
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <HiOutlineLogout className="mr-2 h-5 w-5" />
                                    Sign out
                                </button>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
}