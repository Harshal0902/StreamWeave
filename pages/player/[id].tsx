// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import VideoCard from '../../components/VideoCard';

// interface Video {
//     id: string;
//     title: string;
//     description: string;
//     thumbnail_url: string;
//     video_url: string;
// }

// const VideoDetails: React.FC = () => {
//     const router = useRouter();
//     const { id } = router.query;
//     const [video, setVideo] = useState<Video | null>(null);
//     const [videos, setVideos] = useState<Video[]>([]);

//     useEffect(() => {
//         async function fetchVideo() {
//             try {
//                 const response = await fetch(`/api/player?id=${id}`);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 const videoData = await response.json();
//                 setVideo(videoData);
//             } catch (error) {
//                 console.error('Error fetching video:', error);
//             }
//         }

//         async function fetchAllVideos() {
//             try {
//                 const response = await fetch('/api/getVideo');
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 const videoList = await response.json();
//                 setVideos(videoList);
//             } catch (error) {
//                 console.error('Error fetching videos:', error);
//             }
//         }

//         if (id) {
//             fetchVideo();
//         }

//         fetchAllVideos();
//     }, [id]);

//     if (!video || !videos) {
//         return (
//             <div className='flex items-center justify-center pt-56'>
//                 <p className='text-3xl text-white'>Loading...</p>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className='py-6 px-4'>
//                 <div className='grid place-items-center'>
//                     <video className="md:w-3/4 w-full rounded-t-xl" id="player" controls playsInline>
//                         <source src={video.video_url} type="video/mp4" />
//                         Your browser does not support the video tag.
//                     </video>
//                     <div className='md:w-3/4 w-full bg-white p-4 rounded-b-xl'>
//                         <h2 className='text-2xl font-semibold'>{video.title}</h2>
//                         <p>{video.description}</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="py-8">
//                 <h2 className="text-2xl font-semibold px-6 text-white">More Videos</h2>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-6">
//                     {videos.map((item) => (
//                         <Link key={item.id} href={`/player/${item.id}`} as={`/player/${item.id}`}>
//                             <a>
//                                 <VideoCard
//                                     imageSrc={item.thumbnail_url}
//                                     title={item.title}
//                                     description={item.description}
//                                     videoUrl={item.video_url}
//                                 />
//                             </a>
//                         </Link>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VideoDetails;
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import VideoCard from '../../components/VideoCard';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
}

const VideoDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch(`/api/player?id=${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const videoData = await response.json();
        setVideo(videoData);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    }

    async function fetchAllVideos() {
      try {
        const response = await fetch('/api/getVideo');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const videoList = await response.json();
        setVideos(videoList);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }

    if (id) {
      fetchVideo();
    }

    fetchAllVideos();
  }, [id]);

  const handleVideoClick = async (newId: string) => {
    // Fetch the new video data when a video link is clicked
    try {
      const response = await fetch(`/api/player?id=${newId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const videoData = await response.json();
      setVideo(videoData);

      // Update the video element's src attribute
      const videoElement = document.getElementById('player') as HTMLVideoElement;
      videoElement.src = videoData.video_url;

      // Load and play the new video
      videoElement.load();
      videoElement.play();

      // Update the URL to match the selected video's details
      router.push(`/player/${newId}`);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  if (!video || !videos) {
    return (
      <div className='flex items-center justify-center pt-56'>
        <p className='text-3xl text-white'>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className='py-6 mx-36'>
        <div className='grid place-items-center'>
          <video className="w-3/4 rounded-t-xl" id="player" controls playsInline>
            <source src={video.video_url} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
          <div className='w-3/4 bg-white p-4 rounded-b-xl'>
            <h2 className='text-2xl font-semibold'>{video.title}</h2>
            <p>{video.description}</p>
          </div>
        </div>
      </div>

      <div className="py-8">
        <h2 className="text-2xl font-semibold px-6">More Videos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-6">
          {videos.map((item) => (
            <Link key={item.id} href={`/player/${item.id}`} as={`/player/${item.id}`}>
              <a onClick={() => handleVideoClick(item.id)}>
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

export default VideoDetails;
