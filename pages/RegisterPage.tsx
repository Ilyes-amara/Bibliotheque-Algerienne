import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        nationalId: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const { t } = useLanguage();

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!/^\d{18}$/.test(formData.nationalId)) {
            newErrors.nationalId = 'National ID must be 18 digits.';
        }
        if (!/^(05|06|07)\d{8}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid Algerian phone number (starts with 05, 06, or 07).';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            console.log("Registering user:", formData);
            toast.success('Registration successful! Please log in.');
            setLoading(false);
            navigate('/login');
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
                        {t('create_account')}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {Object.keys(formData).map((key) => {
                        const type = key.includes('password') ? 'password' : key === 'email' ? 'email' : 'text';
                        const placeholder = t(key);
                        return (
                        <div key={key}>
                            <label htmlFor={key} className="sr-only">{placeholder}</label>
                            <input
                                id={key}
                                name={key}
                                type={type}
                                required
                                value={formData[key as keyof typeof formData]}
                                onChange={handleChange}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder={placeholder}
                            />
                            {errors[key] && <p className="text-danger text-xs mt-1">{errors[key]}</p>}
                        </div>
                        )
                    })}
                   
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-danger hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger disabled:bg-gray-400"
                        >
                            {loading ? t('loading') : t('register')}
                        </button>
                    </div>
                </form>
                 <div className="text-center">
                    <p className="text-sm">
                        {t('already_account')} {' '}
                        <NavLink to="/login" className="font-medium text-primary hover:text-primary-focus">
                            {t('login_here')}
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;