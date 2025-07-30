import React from 'react';

const TeamMemberCard = ({ name, position, description, image, isDarkMode }) => {
    return (
        <div
            className={`p-6 rounded-lg shadow-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            } hover:shadow-lg transition w-[280px]`}
        >
            <img
                src={image}
                alt={name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-center">{name}</h3>
            <p className="text-blue-500 text-center">{position}</p>
            <p className="mt-2 text-sm text-center">{description}</p>
        </div>
    );
};


export default TeamMemberCard;
