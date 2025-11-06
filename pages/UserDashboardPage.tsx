import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ECard from '../components/ECard';
import { useData } from '../contexts/DataContext';
import { NavLink } from 'react-router-dom';
import { Book } from '../types';
import toast from 'react-hot-toast';

const UserDashboardPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { t, language } = useLanguage();
    const { rentals, books, generateCard } = useData();

    if (!user) return null;

    const userRentals = rentals.filter(r => r.userId === user.id && r.status === 'rented');

    const getDaysDifference = (dueDate: Date) => {
        const diffTime = new Date(dueDate).getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    const handleGenerateCard = () => {
        const updatedUser = generateCard(user.id);
        if (updatedUser) {
            updateUser(updatedUser);
            toast.success(t('card_generated_success'));
        }
    };

    const RentalCard: React.FC<{ book: Book, dueDate: Date }> = ({ book, dueDate }) => {
        const daysLeft = getDaysDifference(dueDate);
        let statusColor = 'text-green-600';
        if (daysLeft <= 3) statusColor = 'text-yellow-600';
        if (daysLeft < 0) statusColor = 'text-danger';

        return (
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <img src={book.coverImage} alt={language === 'ar' ? book.title_ar : book.title_fr} className="w-12 h-16 object-cover rounded-md" />
                    <div>
                        <p className="font-bold text-text-primary">{language === 'ar' ? book.title_ar : book.title_fr}</p>
                        <p className={`text-sm font-semibold ${statusColor}`}>
                            {daysLeft >= 0 ? `${t('due_in')} ${daysLeft} ${t('days')}` : `${t('overdue_by')} ${Math.abs(daysLeft)} ${t('days')}`}
                        </p>
                    </div>
                </div>
                <button className="px-3 py-1 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                    {t('renew')}
                </button>
            </div>
        );
    };

    const shouldShowGenerateCard = user.subscription && user.subscription.status === 'active' && user.cardStatus === 'none';

    return (
        <div className="space-y-8">
            <div className="bg-surface p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-text-primary">{t('welcome_user')} {user.name.split(' ')[0]}!</h1>
                <p className="text-text-secondary mt-1">Heureux de vous revoir. Voici un aperçu de votre compte.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-surface p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-text-primary">{t('my_current_rentals')} ({userRentals.length})</h2>
                        <div className="space-y-4">
                            {userRentals.length > 0 ? (
                                userRentals.map(rental => {
                                    const book = books.find(b => b.id === rental.bookId);
                                    if (!book) return null;
                                    return <RentalCard key={rental.id} book={book} dueDate={rental.dueDate} />;
                                })
                            ) : (
                                <p className="text-text-secondary py-4 text-center">{t('no_rentals')}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-surface rounded-lg shadow-md">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold text-text-primary">{t('my_ecard')}</h3>
                        </div>
                        <div className="p-6">
                            {shouldShowGenerateCard ? (
                                <div className="text-center">
                                    <p className="mb-4 text-text-secondary">Vous avez un abonnement actif. Générez votre carte pour commencer!</p>
                                    <button onClick={handleGenerateCard} className="px-6 py-2 bg-secondary text-primary-focus font-semibold rounded-lg hover:opacity-90 transition-opacity">
                                        {t('generate_my_card')}
                                    </button>
                                </div>
                            ) : (
                                <ECard />
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-surface p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4 text-text-primary">{t('my_subscription')}</h3>
                        {user.subscription ? (
                            <div className="space-y-2 text-text-secondary">
                                <p className="flex justify-between">{t('plan')}: <span className="font-bold capitalize text-text-primary">{t(user.subscription.plan + '_plan')}</span></p>
                                <p className="flex justify-between">{t('status')}: <span className="font-bold text-green-600">{t(user.subscription.status)}</span></p>
                                <p className="flex justify-between">{t('end_date')}: <span className="font-bold text-text-primary">{new Date(user.subscription.endDate).toLocaleDateString()}</span></p>
                                <NavLink to="/subscribe" className="mt-4 block text-center w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">{t('manage_subscription')}</NavLink>
                            </div>
                        ) : (
                             <div className="text-center">
                                <p className="mb-4 text-text-secondary">{t('no_subscription')}</p>
                                <NavLink to="/subscribe" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg">{t('subscribe_now')}</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;