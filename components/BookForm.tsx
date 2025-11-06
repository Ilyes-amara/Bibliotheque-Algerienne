import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

interface BookFormProps {
    onSubmit: (data: any) => void;
    initialData?: Book | null;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialData }) => {
    const { t } = useLanguage();
    const { categories, racks } = useData();
    const [formData, setFormData] = useState({
        title_fr: '',
        title_ar: '',
        author_fr: '',
        author_ar: '',
        description_fr: '',
        description_ar: '',
        coverImage: '',
        category: categories[0]?.id || '',
        rack: racks[0]?.id || '',
        quantity: 1,
        isRare: false,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title_fr: initialData.title_fr,
                title_ar: initialData.title_ar,
                author_fr: initialData.author_fr,
                author_ar: initialData.author_ar,
                description_fr: initialData.description_fr,
                description_ar: initialData.description_ar,
                coverImage: initialData.coverImage,
                category: initialData.category,
                rack: initialData.rack,
                quantity: initialData.quantity,
                isRare: initialData.isRare,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const name = target.name;
        
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else if (target instanceof HTMLInputElement && target.type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseInt(target.value, 10) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: target.value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="title_fr" label={t('title_fr')} value={formData.title_fr} onChange={handleChange} required />
                <InputField name="title_ar" label={t('title_ar')} value={formData.title_ar} onChange={handleChange} required dir="rtl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="author_fr" label={t('author_fr')} value={formData.author_fr} onChange={handleChange} required />
                <InputField name="author_ar" label={t('author_ar')} value={formData.author_ar} onChange={handleChange} required dir="rtl" />
            </div>
            <InputField name="coverImage" label={t('cover_image_url')} value={formData.coverImage} onChange={handleChange} required />
            
            <TextareaField name="description_fr" label={t('description_fr')} value={formData.description_fr} onChange={handleChange} />

            <TextareaField name="description_ar" label={t('description_ar')} value={formData.description_ar} onChange={handleChange} dir="rtl"/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField name="category" label={t('category')} value={formData.category} onChange={handleChange} options={categories.map(c => ({ value: c.id, label: c.name_fr }))} />
                <SelectField name="rack" label={"Rack"} value={formData.rack} onChange={handleChange} options={racks.map(r => ({ value: r.id, label: r.location }))} />
                <InputField name="quantity" label={t('quantity')} type="number" value={formData.quantity} onChange={handleChange} required />
            </div>
            
            <div className="flex items-center">
                <input type="checkbox" id="isRare" name="isRare" checked={formData.isRare} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="isRare" className="ml-2 block text-sm font-medium text-text-secondary">{t('is_rare')}</label>
            </div>

            <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-2 bg-danger text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-colors">
                    {t('save_changes')}
                </button>
            </div>
        </form>
    );
};

// Helper components for form fields
const InputField: React.FC<any> = ({ name, label, ...rest }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <input id={name} name={name} {...rest} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
    </div>
);

const TextareaField: React.FC<any> = ({ name, label, ...rest }) => (
    <div>
        {label && <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>}
        <textarea id={name} name={name} rows={3} {...rest} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
    </div>
);

const SelectField: React.FC<any> = ({ name, label, options, ...rest }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <select id={name} name={name} {...rest} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);


export default BookForm;