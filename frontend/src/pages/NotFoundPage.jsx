import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
            <h1 className="text-6xl font-bold text-indigo-600">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-800">Page Not Found</h2>
            <p className="mt-2 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
            <Link
                to="/"
                className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700"
            >
                Go back home
            </Link>
        </div>
    );
}