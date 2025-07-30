import React from 'react';

const ProductCard = ({ title, description, icon, isDarkMode }) => {
    return (
        <div
            className={`p-6 rounded-lg shadow-md ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } hover:shadow-lg transition`}
        >
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-sm">{description}</p>
        </div>
    );
};

export default ProductCard;
