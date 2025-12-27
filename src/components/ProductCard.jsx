import React, { useState } from 'react';
import { addCartItem } from '../store/cartStore';

export default function ProductCard({ product }) {
  // По умолчанию выбираем первый вариант объема (например, 250мл)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  const handleAddToCart = () => {
    addCartItem({
      id: product.id,
      name: product.name,
      variant: selectedVariant, // Добавляем конкретный выбранный объем
      image: product.image,
      price: selectedVariant.price
    });
    
    // Можно добавить простую анимацию или алерт
    alert('Добавлено в корзину!');
  };

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-brand-yellow/20">
      
      {/* Свечение позади банки (Atmosphere) */}
      <div className="absolute inset-0 bg-brand-yellow/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

      {/* Бейджи (например "Гродно") */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {product.badges.map(badge => (
          <span key={badge} className="bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
            {badge}
          </span>
        ))}
      </div>

      {/* Изображение */}
      <div className="relative z-10 h-64 flex items-center justify-center mb-4">
        {/* Картинка должна быть с прозрачным фоном! */}
        <img 
            src={product.image} 
            alt={product.name} 
            className="h-full object-contain drop-shadow-xl"
        />
      </div>

      {/* Информация */}
      <div className="relative z-10 text-center">
        <div className="text-brand-yellow text-xs font-bold tracking-widest uppercase mb-1 opacity-80">
            {product.harvest}
        </div>
        <h3 className="text-2xl font-heading font-bold text-white mb-2 leading-none">
            {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {product.description}
        </p>

        {/* Выбор размера (Граммовки) */}
        <div className="flex justify-center gap-2 mb-6">
          {product.variants.map((variant) => (
            <button
              key={variant.size}
              onClick={() => setSelectedVariant(variant)}
              className={`px-3 py-1 rounded text-xs font-bold border transition-colors cursor-pointer
                ${selectedVariant.size === variant.size 
                    ? 'bg-white text-brand-dark border-white' 
                    : 'bg-transparent text-gray-400 border-gray-600 hover:border-white'}`}
            >
              {variant.size}
            </button>
          ))}
        </div>

        {/* Цена и кнопка */}
        <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-4">
            <div className="text-left">
                <div className="text-xs text-gray-500">Цена:</div>
                <div className="text-xl font-bold text-brand-yellow">
                    {selectedVariant.price} BYN
                </div>
            </div>
            
            <button 
                onClick={handleAddToCart}
                className="bg-brand-yellow text-brand-dark hover:bg-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
            >
                Купить
            </button>
        </div>
      </div>
    </div>
  );
}