import React, { useState } from 'react';
import { addCartItem } from '../store/cartStore';

export default function ProductViewer({ product }) {
  // Выбираем первый вариант по умолчанию
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  
  // Состояния для счетчика и анимации кнопки
  const [count, setCount] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Логика счетчика (максимум 99, минимум 1)
  const increment = () => setCount(prev => (prev < 99 ? prev + 1 : prev));
  const decrement = () => setCount(prev => (prev > 1 ? prev - 1 : prev));

  // Логика добавления в корзину
  const handleAddToCart = () => {
    addCartItem({
      id: product.id,
      name: product.name,
      variant: selectedVariant,
      image: product.image,
      price: selectedVariant.price
    }, count);

    setIsAdded(true);
    setCount(1); // Сбрасываем счетчик
    setTimeout(() => setIsAdded(false), 1000); // Сбрасываем анимацию кнопки через 1с
  };

  return (
    <div className="flex flex-col h-full justify-center">
        
        {/* БЕЙДЖИ И КАТЕГОРИИ */}
        <div className="flex gap-2 mb-6 flex-wrap">
            {product.badges.map(badge => (
                <span key={badge} className="bg-brand-yellow text-black px-3 py-1 text-sm font-bold uppercase tracking-wider rounded">
                    {badge}
                </span>
            ))}
            {/* Бейдж категории */}
            <span className="border border-gray-600 text-gray-400 px-3 py-1 text-sm uppercase tracking-wider rounded">
                {product.category === 'honey' ? 'Мёд' : 
                 product.category === 'tea' ? 'Чай' : 
                 product.category === 'packaging' ? 'Упаковка' : 
                 product.category === 'nuts' ? 'Орехи' : 
                 product.category === 'cream' ? 'Крем-мёд' : 'Натурпродукт'}
            </span>
        </div>

        {/* ЗАГОЛОВОК */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            {product.name}
        </h1>

        {/* ОПИСАНИЕ */}
        <p className="text-gray-300 text-lg leading-relaxed mb-8 border-l-2 border-brand-yellow pl-4">
            {product.description}
        </p>

        {/* ВЫБОР ВАРИАНТА (ГРАММОВКИ) */}
        <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3 font-bold uppercase tracking-widest">
                {product.category === 'packaging' ? 'Выберите размер:' : 'Выберите объем:'}
            </p>
            <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                    <button
                        key={variant.size}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-6 py-3 rounded-lg text-sm font-bold border transition-all cursor-pointer flex flex-col items-center min-w-[100px]
                        ${selectedVariant.size === variant.size 
                            ? 'bg-white text-brand-dark border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105' 
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-brand-yellow hover:text-white'}`}
                    >
                        <span className="text-lg">{variant.size}</span>
                        {/* Показываем цену прямо на кнопке для удобства */}
                        <span className="text-xs opacity-70 mt-1 font-normal">{variant.price} BYN</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="h-px bg-white/10 w-full mb-8"></div>

        {/* --- НИЖНИЙ БЛОК: ЦЕНА + СЧЕТЧИК + КНОПКА --- */}
        {/* На планшетах (вертикальных) это будет колонка, на больших экранах (XL) - строка */}
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center mt-auto">
            
            {/* Группа: Цена и Счетчик */}
            {/* На мобильном - растянута (justify-between), на компе - компактная */}
            <div className="flex w-full xl:w-auto items-center justify-between gap-6">
                
                {/* ЦЕНА */}
                <div>
                    <div className="text-3xl font-bold text-brand-yellow whitespace-nowrap">
                        {selectedVariant.price} BYN
                    </div>
                    <div className="text-sm text-gray-500">Цена за 1 шт.</div>
                </div>

                {/* СЧЕТЧИК (Сделал выше - h-14) */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg h-14">
                    <button 
                        onClick={decrement} 
                        className="w-12 h-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-xl leading-none rounded-l-lg"
                    >-</button>
                    
                    <span className="text-white font-bold w-10 text-center text-lg">{count}</span>
                    
                    <button 
                        onClick={increment} 
                        className="w-12 h-full text-gray-400 hover:text-brand-yellow hover:bg-white/5 transition-colors cursor-pointer text-xl leading-none rounded-r-lg"
                    >+</button>
                </div>
            </div>

            {/* КНОПКА КУПИТЬ */}
            {/* Широкая (w-full) на мобилках/планшетах. shrink-0 запрещает ей сжиматься */}
            <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`
                    h-14 w-full xl:w-auto px-10 rounded-lg font-bold font-heading uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer text-lg shrink-0
                    ${isAdded 
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)]' 
                        : 'bg-brand-yellow text-brand-dark hover:bg-white hover:text-black'}
                `}
            >
                {isAdded ? (
                    <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                    В корзине
                    </>
                ) : (
                    'В корзину'
                )}
            </button>
        </div>
        
    </div>
  );
}