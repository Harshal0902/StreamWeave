import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import VideoCard from '../../components/VideoCard';
import Web3 from 'web3';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios'; // Import Axios

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    video_url: string;
    wallet_address: string;
}

const VideoDetails: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [video, setVideo] = useState<Video | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [showDonate, setShowDonate] = React.useState(false);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        async function fetchVideo() {
            try {
                const response = await axios.get(`/api/player?id=${id}`); // Use Axios to fetch data
                const videoData = response.data;
                setVideo(videoData);
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        }

        async function fetchAllVideos() {
            try {
                const response = await axios.get('/api/getVideo'); // Use Axios to fetch data
                const videoList = response.data;
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
        try {
            const response = await axios.get(`/api/player?id=${newId}`); // Use Axios to fetch data
            const videoData = response.data;
            setVideo(videoData);

            const videoElement = document.getElementById('player') as HTMLVideoElement;
            videoElement.src = videoData.video_url;

            videoElement.load();
            videoElement.play();

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

    const sendCrypto = async () => {
        try {
            // @ts-ignore
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed.');
            }
            //   @ts-ignore
            const web3 = new Web3(window.ethereum);
            //   @ts-ignore
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                throw new Error('No Ethereum accounts found in MetaMask.');
            }
            const senderAddress = accounts[0];
            const amountWei = web3.utils.toWei(amount, 'ether');

            await web3.eth.sendTransaction({
                from: senderAddress,
                to: video.wallet_address,
                value: amountWei,
            });
            console.log(`Successfully sent ${amount} ETH to ${video.wallet_address}`);
        } catch (error) {
            // @ts-ignore
            console.error('Error sending cryptocurrency:', error.message);
        }
    };

    return (
        <div>
            <div className='py-6 md:mx-36 mx-4'>
                <div className='grid place-items-center'>
                    <video className="md:w-3/4 rounded-t-xl" id="player" controls playsInline>
                        <source src={video.video_url} type='video/mp4' />
                        Your browser does not support the video tag.
                    </video>
                    <div className='md:flex md:flex-row justify-between items-center md:w-3/4 w-full bg-white rounded-b-xl p-4'>
                        <div className='bg-white rounded-b-xl'>
                            <h2 className='md:text-2xl text-xl font-semibold'>{video.title}</h2>
                            <p>{video.description}</p>
                        </div>
                        <div>
                            <button className='bg-secondary text-white rounded-md px-4 py-2' onClick={() => setShowDonate(true)}>Donate</button>
                        </div>
                    </div>
                </div>
            </div>

            {showDonate && (
                <div className="flex overflow-x-hidden h-screen backdrop-blur-sm overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative flex justify-center items-center h-screen my-6 md:mx-auto md:w-1/4 w-full mx-2">
                        <div className="border-0 relative flex flex-col space-y-5  w-full p-4 bg-gray-300 rounded shadow-xl outline-none focus:outline-none">
                            <div className='flex justify-between'>
                                <div>
                                    <p className="text-xl mb-2">Donate to the owner</p>
                                </div>
                                <div>
                                    <button className='text-2xl' onClick={() => setShowDonate(false)}><AiOutlineClose /></button>
                                </div>
                            </div>

                            <div className='grid gap-1'>
                                <label>Recipient Address:</label>
                                <input className='px-2 py-1 rounded-lg'
                                    type="text"
                                    value={video.wallet_address}
                                    onChange={(e) => setRecipientAddress(e.target.value)}

                                />
                            </div>
                            <div className='grid gap-1'>
                                <label>Amount (ETH):</label>
                                <input className='px-2 py-1 rounded-lg'
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={sendCrypto}
                                className="px-3 py-1 my-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-8 px-4">
                <h2 className="text-2xl font-semibold px-6 text-white py-4">More Videos</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-6">
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
