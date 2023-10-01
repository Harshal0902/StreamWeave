import React from 'react';
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion"
import { fade } from "../animation"

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
            <motion.div variants={fade} initial="hidden" animate="visible" className="flex items-center border rounded-lg p-2 shadow-md md:w-1/2">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-primary text-white border-none focus:outline-none w-full"
                    onChange={handleSearch}
                />
            </motion.div>
        </div>
    );
};

export default SearchBar;