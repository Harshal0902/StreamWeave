"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoCard from '../../_components/VideoCard';
import Web3 from 'web3';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { motion } from "framer-motion"
import { fade, fadeLogo } from '../../animation';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    video_url: string;
    wallet_address: string;
}

export default function Page({ params }: { params: { id: string } }) {
    const [videoDetails, setVideoDetails] = useState<Video | null>(null);
    const [allVideos, setAllVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showDonate, setShowDonate] = React.useState(false);
    const [donationAmount, setDonationAmount] = useState<string>('');

    useEffect(() => {
        axios.get(`/api/player?id=${params.id}`)
            .then((response) => {
                setVideoDetails(response.data);
            })
            .catch((error) => {
                console.error('Error fetching video details:', error);
            })
            .finally(() => {
                setLoading(false);
            });

        axios.get('/api/getVideo')
            .then((response) => {
                setAllVideos(response.data);
            })
            .catch((error) => {
                console.error('Error fetching all video data:', error);
            });
    }, [params.id]);

    const sendCrypto = async () => {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed.');
            }

            const web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();

            if (accounts.length === 0) {
                throw new Error('No Ethereum accounts found in MetaMask.');
            }

            const senderAddress = accounts[0];
            const amountWei = web3.utils.toWei(donationAmount, 'ether');

            // Check if videoDetails is not null before accessing wallet_address
            if (videoDetails) {
                await web3.eth.sendTransaction({
                    from: senderAddress,
                    to: videoDetails.wallet_address,
                    value: amountWei,
                });
                console.log(`Successfully sent ${donationAmount} ETH to ${videoDetails.wallet_address}`);
            } else {
                throw new Error('Video details are null.');
            }
        } catch (error) {
            // @ts-ignore
            console.error('Error sending cryptocurrency:', error.message);
        }
    };


    return (
        <div className='py-6 md:mx-36 mx-4'>
            {loading ? (
                <div className='flex items-center justify-center pt-56'>
                    <p className='text-3xl text-white'>Loading...</p>
                </div>
            ) : videoDetails ? (
                <motion.div variants={fadeLogo} initial="hidden" animate="visible" className='w-full grid place-items-center'>
                    <video className="md:w-3/4 rounded-t-xl" id="player" controls playsInline>
                        <source src={videoDetails.video_url} type='video/mp4' />
                        Your browser does not support the video tag.
                    </video>
                    <div className='md:flex md:flex-row justify-between items-center md:w-3/4 w-full bg-white rounded-b-xl p-4'>
                        <div className='bg-white rounded-b-xl'>
                            <h2 className='md:text-2xl text-xl font-semibold'>{videoDetails.title}</h2>
                            <p>{videoDetails.description}</p>
                        </div>
                        <div>
                            <button className='bg-secondary text-white rounded-md px-4 py-2' onClick={() => setShowDonate(true)}>Donate</button>
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
                                        <input
                                            className='px-2 py-1 rounded-lg'
                                            type="text"
                                            value={videoDetails.wallet_address}
                                            readOnly
                                        />
                                    </div>
                                    <div className='grid gap-1'>
                                        <label>Amount (ETH):</label>
                                        <input
                                            className='px-2 py-1 rounded-lg'
                                            type="text"
                                            value={donationAmount}
                                            onChange={(e) => setDonationAmount(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="px-3 py-1 my-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={sendCrypto}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="py-8">
                        <motion.div variants={fadeLogo} initial="hidden" animate="visible">
                            <h2 className="text-2xl font-semibold px-6 text-white py-4">More Videos</h2>
                        </motion.div>
                        <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-6">
                            {allVideos.map((video) => (
                                <motion.div layout>
                                    <Link key={video.id} href={`/player/${video.id}`} as={`/player/${video.id}`}>
                                        <VideoCard
                                            imageSrc={video.thumbnail_url}
                                            title={video.title}
                                            description={video.description}
                                            videoUrl={video.video_url}
                                        />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                <div className='flex items-center justify-center pt-56'>
                    <p className='text-3xl text-white'>Video not found</p>
                </div>
            )}
        </div>
    );
}
