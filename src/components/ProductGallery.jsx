import React, { useState } from 'react';

export default function ProductGallery({ mainImage, gallery = [], productId }) {
  const [currentImg, setCurrentImg] = useState(mainImage);
  
  // Убираем дубликаты
  const allImages = Array.from(new Set([mainImage, ...gallery]));
  const isMain = currentImg === mainImage;

  return (
    <div className="flex flex-col items-center w-full">
        
        {/* --- ГЛАВНАЯ СЦЕНА --- */}
        {/* БЫЛО: mb-8. СТАЛО: mb-12 (увеличили отступ снизу) */}
        <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center mb-12 perspective-1000">
            
            <div 
                className={`absolute inset-0 bg-brand-yellow/20 rounded-full blur-[80px] transition-opacity duration-700
                ${isMain ? 'opacity-100' : 'opacity-0'}`}
            ></div>

            <img 
                key={currentImg}
                src={currentImg} 
                alt="Product"
                style={isMain ? { viewTransitionName: `image-${productId}` } : {}}
                className={`
                    relative z-10 transition-all duration-500 cursor-pointer
                    ${isMain 
                        ? 'w-full max-h-full object-contain drop-shadow-2xl hover:scale-105'
                        : 'w-full h-full object-cover rounded-2xl shadow-lg border border-white/10'
                    }
                `}
            />
        </div>

        {/* --- ЛЕНТА МИНИАТЮР --- */}
        {allImages.length > 1 && (
            // БЫЛО: px-2. СТАЛО: p-4 (добавили отступы со всех сторон, чтобы glow-эффект не обрезался)
            <div className="flex gap-4 overflow-x-auto p-4 w-full justify-center">
                {allImages.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImg(img)}
                        className={`
                            relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 cursor-pointer
                            ${currentImg === img 
                                ? 'border-brand-yellow shadow-[0_0_15px_rgba(255,242,0,0.5)] scale-110 z-10' /* z-10 чтобы активный был поверх соседей */
                                : 'border-transparent opacity-60 hover:opacity-100 bg-white/5'}
                        `}
                    >
                        <img 
                            src={img} 
                            alt={`View ${index}`} 
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        )}

    </div>
  );
}