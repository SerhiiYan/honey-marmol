import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  // ИСПРАВЛЕНИЕ: Всегда начинаем с 'all', чтобы совпадало с сервером (SSR)
  const [activeCategory, setActiveCategory] = useState('all');

  // Категории
  const categories = [
    { id: 'all', label: 'Всё' },
    { id: 'honey', label: 'Мёд' },
    { id: 'nuts', label: 'С орехами' },
    { id: 'cream', label: 'Крем-мёд' },
    { id: 'bee-products', label: 'Здоровье' }, 
    { id: 'tea', label: 'Чай' },
    { id: 'packaging', label: 'Упаковка' },
  ];

  // Эффект для синхронизации с URL (Срабатывает только в браузере)
  useEffect(() => {
    // 1. Функция чтения категории из URL
    const getCategoryFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      return params.get('category') || 'all';
    };

    // 2. Устанавливаем категорию при первой загрузке
    setActiveCategory(getCategoryFromUrl());

    // 3. Слушаем кнопку "Назад" в браузере
    const handlePopState = () => {
      setActiveCategory(getCategoryFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // [] означает, что это сработает 1 раз при монтаже компонента

  // Функция клика по кнопке
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    
    // Меняем URL
    const url = new URL(window.location);
    if (catId === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', catId);
    }
    window.history.pushState({}, '', url);
  };

  // Фильтрация
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div>
      {/* Кнопки фильтров */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all cursor-pointer
              ${activeCategory === cat.id 
                ? 'bg-brand-yellow text-brand-dark shadow-[0_0_20px_rgba(255,242,0,0.4)] transform scale-105' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          В этой категории товаров пока нет.
        </div>
      )}
    </div>
  );
}