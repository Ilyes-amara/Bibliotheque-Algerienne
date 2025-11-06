import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import BookCard from '../components/BookCard';
import { Category } from '../types';

const BooksPage: React.FC = () => {
    const { books, categories } = useData();
    const { t, language, dir } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredBooks = books.filter(book => {
        const title = language === 'ar' ? book.title_ar : book.title_fr;
        const author = language === 'ar' ? book.author_ar : book.author_fr;
        const searchMatch = title.toLowerCase().includes(searchTerm.toLowerCase()) || author.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
        return searchMatch && categoryMatch;
    });

    return (
        <div className="space-y-8">
            <section className="bg-surface p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4 text-text-primary">{t('books')}</h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder={t('search_books')}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        />
                         <span className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                         </span>
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                        <option value="all">{t('all_categories')}</option>
                        {categories.map((cat: Category) => (
                            <option key={cat.id} value={cat.id}>
                                {language === 'ar' ? cat.name_ar : cat.name_fr}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <section>
                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredBooks.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-surface rounded-lg shadow-md">
                        <h3 className="text-xl text-text-secondary">{t('no_books_found')}</h3>
                    </div>
                )}
            </section>
        </div>
    );
};

export default BooksPage;