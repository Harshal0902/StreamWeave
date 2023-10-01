import React from 'react';
import { FaSearch } from "react-icons/fa";

type SearchBarProps = {
    onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const handleSearch = (e: { target: { value: any; }; }) => {
        const query = e.target.value;
        onSearch(query);
    };

    return (
        <div className='grid place-items-center'>
            <div className="flex items-center border rounded-lg p-2 shadow-md md:w-1/2">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-primary text-white border-none focus:outline-none w-full"
                    onChange={handleSearch}
                />
            </div>
        </div>
    );
};

export default SearchBar;