import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className='grid place-items-center'>
            <div className='flex flex-row items-center justify-center text-lg md:text-xl'>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='rounded-l-lg'/>
                <button onClick={handleSearch} className='bg-secondary px-2 text-white rounded-r-lg'>Search</button>
            </div>
        </div>
    );
};

export default SearchBar;
