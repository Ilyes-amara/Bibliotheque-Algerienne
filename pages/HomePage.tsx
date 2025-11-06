import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import BookCard from '../components/BookCard';

const HomePage: React.FC = () => {
    const { t } = useLanguage();
    const { books } = useData();

    const featuredBooks = books.slice(0, 4);

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center py-16 px-4 bg-surface rounded-lg shadow-lg" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/arabesque.png')`}}>
                <div className="bg-surface/80 backdrop-blur-sm py-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
                        {t('welcome')} {t('to')} {t('algerian_library')}
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
                        {t('hero_subtitle')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <NavLink 
                            to="/books" 
                            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus transition-transform transform hover:scale-105"
                        >
                            {t('browse_books')}
                        </NavLink>
                        <NavLink 
                            to="/register" 
                            className="px-8 py-3 bg-danger text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105"
                        >
                            {t('join_now')}
                        </NavLink>
                    </div>
                </div>
            </section>
            
            {/* Featured Books Section */}
            <section>
                <h2 className="text-3xl font-bold text-center mb-8 text-text-primary">{t('featured_books')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
                <div className="text-center mt-8">
                    <NavLink to="/books" className="text-primary font-semibold hover:underline">
                        {t('view_all_books')} &rarr;
                    </NavLink>
                </div>
            </section>

            {/* How it works Section */}
            <section className="py-12 bg-gray-100 rounded-lg">
                <h2 className="text-3xl font-bold text-center mb-10 text-text-primary">{t('how_it_works')}</h2>
                <div className="grid md:grid-cols-4 gap-8 text-center px-4">
                    <div className="flex flex-col items-center">
                        <div className="bg-danger text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">1</div>
                        <h3 className="font-bold text-lg mb-2 text-text-primary">{t('register_step')}</h3>
                        <p className="text-text-secondary">{t('register_step_desc')}</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-danger text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">2</div>
                        <h3 className="font-bold text-lg mb-2 text-text-primary">{t('subscribe_step')}</h3>
                        <p className="text-text-secondary">{t('subscribe_step_desc')}</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-danger text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">3</div>
                        <h3 className="font-bold text-lg mb-2 text-text-primary">{t('rent_step')}</h3>
                        <p className="text-text-secondary">{t('rent_step_desc')}</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="bg-danger text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">4</div>
                        <h3 className="font-bold text-lg mb-2 text-text-primary">{t('read_step')}</h3>
                        <p className="text-text-secondary">{t('read_step_desc')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;