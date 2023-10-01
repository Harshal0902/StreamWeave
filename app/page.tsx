"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoCard from './_components/VideoCard';
import SearchBar from './_components/SearchBar';
import axios from 'axios';
import { motion } from "framer-motion"

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
}

const Page: React.FC = () => {
  const [data, setData] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Video[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/getVideo');
        const data = response.data;
        setData(data);
        setLoading(false);
      } catch (error) {
        // @ts-ignore
        setError(error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center pt-56'>
        <p className='text-3xl text-white'>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      <div className="flex justify-center items-center py-8 mx-8">
        <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searchTerm ? (
            filteredData.map((item) => (
              <motion.div layout>
                <Link key={item.id} href={`/player/${item.id}`} as={`/player/${item.id}`}>
                  <VideoCard
                    imageSrc={item.thumbnail_url}
                    title={item.title}
                    description={item.description}
                    videoUrl={item.video_url}
                  />
                </Link>
              </motion.div>
            ))
          ) : (
            data.map((item) => (
              <Link key={item.id} href={`/player/${item.id}`} as={`/player/${item.id}`}>
                <VideoCard
                  imageSrc={item.thumbnail_url}
                  title={item.title}
                  description={item.description}
                  videoUrl={item.video_url}
                />
              </Link>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
