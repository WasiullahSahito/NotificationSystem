import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });
    const { register, token } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData);
    };

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Create Account</h2>
                <form onSubmit={handleSubmit}>
                    {/* ... Form Inputs for Username, Email, Password, Phone ... */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input name="username" type="text" onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" type="email" onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input name="password" type="password" onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                        <input name="phone" type="tel" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 focus:outline-none"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}