import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';

const ITEMS_PER_PAGE = 6;

export default function ProductGrid({ products }) {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // 1. ИНИЦИАЛИЗАЦИЯ: Пытаемся достать сохраненное количество из памяти
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCount = sessionStorage.getItem('marmol_catalog_count');
      return savedCount ? parseInt(savedCount) : ITEMS_PER_PAGE;
    }
    return ITEMS_PER_PAGE;
  });

  const categories = [
    { id: 'all', label: 'Всё' },
    { id: 'honey', label: 'Мёд' },
    { id: 'nuts', label: 'С орехами' },
    { id: 'cream', label: 'Крем-мёд' },
    { id: 'bee-products', label: 'Здоровье' }, 
    { id: 'packaging', label: 'Упаковка' },
    { id: 'tea', label: 'Чай' },
  ];

  // Синхронизация с URL при загрузке
  useEffect(() => {
    const getCategoryFromUrl = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return params.get('category') || 'all';
      }
      return 'all';
    };

    const cat = getCategoryFromUrl();
    setActiveCategory(cat);
    
    // ВАЖНО: Мы НЕ сбрасываем visibleCount здесь, 
    // чтобы при кнопке "Назад" (popstate) количество сохранялось.

    const handlePopState = () => {
      setActiveCategory(getCategoryFromUrl());
      // При нажатии "Назад" браузер сам возьмет состояние из useState (которое инициализировалось из sessionStorage)
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. ФУНКЦИЯ ДЛЯ КНОПКИ "ПОКАЗАТЬ ЕЩЕ"
  const showMore = () => {
    const newCount = visibleCount + ITEMS_PER_PAGE;
    setVisibleCount(newCount);
    // Сохраняем новое число в память
    sessionStorage.setItem('marmol_catalog_count', newCount.toString());
  };

  // 3. ФУНКЦИЯ СМЕНЫ ФИЛЬТРА
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    
    // При РУЧНОМ переключении категории - сбрасываем на 6
    setVisibleCount(ITEMS_PER_PAGE);
    sessionStorage.setItem('marmol_catalog_count', ITEMS_PER_PAGE.toString());
    
    const url = new URL(window.location);
    if (catId === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', catId);
    }
    window.history.pushState({}, '', url);
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

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
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          В этой категории товаров пока нет.
        </div>
      )}

      {/* КНОПКА ПОКАЗАТЬ ЕЩЕ */}
      {hasMore && (
        <div className="mt-12 text-center">
            <button 
                onClick={showMore} // Используем нашу новую функцию
                className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 border border-white/20 rounded-full hover:bg-white hover:text-black hover:border-transparent focus:outline-none"
            >
                <span>Показать еще</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            <p className="text-gray-500 text-xs mt-3">
                Показано {visibleProducts.length} из {filteredProducts.length}
            </p>
        </div>
      )}
    </div>
  );
}