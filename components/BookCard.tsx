import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BookCardProps {
    book: Book;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#D4AF37" : "none"} stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);


const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const { language, t } = useLanguage();
    const title = language === 'ar' ? book.title_ar : book.title_fr;
    const author = language === 'ar' ? book.author_ar : book.author_fr;

    return (
        <div className="bg-surface rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
            <NavLink to={`/books/${book.id}`} className="block">
                <div className="relative">
                    <img src={book.coverImage} alt={title} className="w-full h-64 object-cover" />
                    <div className="absolute top-2 right-2">
                        {book.available > 0 ? (
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-primary rounded-full">{t('available')}</span>
                        ) : (
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-danger rounded-full">{t('unavailable')}</span>
                        )}
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold truncate text-text-primary group-hover:text-danger transition-colors">{title}</h3>
                    <p className="text-sm text-text-secondary mb-2">{author}</p>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < Math.round(book.rating)} />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">({book.reviews})</span>
                    </div>
                </div>
            </NavLink>
        </div>
    );
};

export default BookCard;