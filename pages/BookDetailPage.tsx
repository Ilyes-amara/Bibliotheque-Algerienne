import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { findBook, findCategory, rentals } = useData();
    const { language, t } = useLanguage();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const book = id ? findBook(id) : undefined;
    
    if (!book) {
        return <div className="text-center text-2xl font-bold">{t('book_not_found')}</div>;
    }

    const category = findCategory(book.category);
    
    const title = language === 'ar' ? book.title_ar : book.title_fr;
    const author = language === 'ar' ? book.author_ar : book.author_fr;
    const description = language === 'ar' ? book.description_ar : book.description_fr;
    const categoryName = category ? (language === 'ar' ? category.name_ar : category.name_fr) : '';

    const handleRent = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!user?.subscription || user.subscription.status !== 'active') {
            toast.error("You need an active subscription to rent a book.");
            navigate('/subscribe');
            return;
        }
        if (book.isRare && user.subscription.plan !== 'premium') {
             toast.error("You need a Premium plan to rent rare books.");
             return;
        }

        // Mock rental request
        toast.success(`Rental request for "${title}" sent!`);
    };
    
    const getEstimatedAvailability = () => {
        if (book.available > 0) return null;
        
        const rentedCopies = rentals.filter(r => r.bookId === book.id && r.status === 'rented');
        if (rentedCopies.length === 0) return null; // Should not happen if available is 0, but good for safety

        const earliestDueDate = new Date(Math.min(...rentedCopies.map(r => new Date(r.dueDate).getTime())));
        return earliestDueDate.toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR');
    }

    const estimatedAvailability = getEstimatedAvailability();


    return (
        <div className="bg-surface p-8 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex-shrink-0">
                    <img src={book.coverImage} alt={title} className="w-full h-auto object-cover rounded-lg shadow-md" />
                </div>
                <div className="md:w-2/3">
                    <h1 className="text-4xl font-bold mb-2 text-text-primary">{title}</h1>
                    <h2 className="text-2xl text-text-secondary mb-4">{author}</h2>
                    <div className="flex items-center gap-4 mb-4 text-sm text-text-secondary">
                        <span>{t('category')}: <span className="font-semibold text-primary">{categoryName}</span></span>
                        <span>|</span>
                        <span>{t('rating')}: <span className="font-semibold text-secondary">{book.rating} ({book.reviews} {t('reviews')})</span></span>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
                        <div><span className="font-semibold">{t('availability')}:</span> {book.available > 0 ? <span className="text-green-600 font-bold">{t('available')}</span> : <span className="text-danger font-bold">{t('unavailable')}</span>}</div>
                        <div><span className="font-semibold">{t('quantity')}:</span> {book.quantity}</div>
                        <div><span className="font-semibold">{t('available')}:</span> {book.available}</div>
                        {book.isRare && <div><span className="font-semibold text-purple-600">{t('rare_book')}</span></div>}
                        <div className="col-span-2 flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-md">
                            <FaMapMarkerAlt className="text-blue-500" />
                            <span className="font-medium">{t('location')}: </span>
                            <span className="font-semibold">{book.location || 'A12-3B-45'}</span>
                        </div>
                    </div>

                    {estimatedAvailability && (
                        <div className="mb-6 p-3 bg-yellow-100 text-yellow-800 border-l-4 border-secondary rounded-r-lg">
                            <p><span className="font-bold">{t('estimated_availability')}:</span> {estimatedAvailability}</p>
                        </div>
                    )}


                    <button
                        onClick={handleRent}
                        disabled={book.available <= 0}
                        className="w-full md:w-auto px-8 py-3 bg-danger text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isAuthenticated ? t('rent_book') : t('login_to_rent')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;