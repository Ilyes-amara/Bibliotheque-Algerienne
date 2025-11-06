import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { users } = useData();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock API call
        setTimeout(() => {
            const user = users.find(u => u.email === email);
            if (user) { // In a real app, you'd check password hash
                login(user);
                toast.success(`${t('welcome')} ${user.name}!`);
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                toast.error('Invalid email or password.');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-surface p-10 rounded-xl shadow-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
                            {t('login_to_account')}
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder={t('email_address')}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder={t('password')}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? t('loading') : t('login')}
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-sm">
                            {t('no_account')} {' '}
                            <NavLink to="/register" className="font-medium text-danger hover:text-red-700">
                                {t('register_here')}
                            </NavLink>
                        </p>
                    </div>
                </div>

                <div className="bg-primary/5 border-l-4 border-primary text-primary-focus p-4 rounded-r-lg shadow-sm">
                    <h4 className="font-bold text-lg">{t('demo_accounts')}</h4>
                    <div className="text-sm mt-3 space-y-2">
                        <div>
                            <p><strong>{t('admin_account')}:</strong> <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-md">admin@library.dz</kbd></p>
                            <p className="text-xs mt-1 pl-2">↳ Try the Rack Management feature!</p>
                        </div>
                        <p><strong>{t('user_account')} (Full Features):</strong> <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-md">user@library.dz</kbd></p>
                        <p><strong>{t('user_account')} (Generate Card):</strong> <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-md">samir@library.dz</kbd></p>
                        <p className="pt-1 text-xs">(Any password will work)</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;