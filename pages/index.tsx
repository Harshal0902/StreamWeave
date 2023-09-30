import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoCard from '../components/VideoCard';

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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/getVideo');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
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

      <div className="flex justify-center items-center py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <Link key={item.id} href={`/player/${item.id}`} as={`/player/${item.id}`}>
              <a>
                <VideoCard
                  imageSrc={item.thumbnail_url}
                  title={item.title}
                  description={item.description}
                  videoUrl={item.video_url}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Page;
