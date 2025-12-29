import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  // Текущая выбранная категория (all - показать всё)
  const [activeCategory, setActiveCategory] = useState('all');

  // Список категорий для кнопок
  const categories = [
    { id: 'all', label: 'Всё' },
    { id: 'honey', label: 'Мёд' },
    { id: 'nuts', label: 'С орехами' },
    { id: 'cream', label: 'Крем-мёд' },
    { id: 'bee-products', label: 'Здоровье' }, // Сюда попадут перга, пыльца, молочко
    { id: 'tea', label: 'Чай' },
  ];

  // Фильтруем товары на лету
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
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all
              ${activeCategory === cat.id 
                ? 'bg-brand-yellow text-brand-dark shadow-[0_0_20px_rgba(255,242,0,0.4)]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Сетка товаров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Если ничего не найдено */}
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          В этой категории товаров пока нет.
        </div>
      )}
    </div>
  );
}