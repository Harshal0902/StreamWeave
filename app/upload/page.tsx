"use client"

import { useEffect, useState } from 'react';
import { Othent } from 'othent';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion"
import { fadeLogo } from '../animation'

interface PostData {
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    wallet_address: string;
}

export default function UploadOthent() {
    const router = useRouter();

    const othnetAPI = process.env.NEXT_PUBLIC_APP_ID

    const [video, setVideo] = useState<File | null>(null);
    const [thumb, setThumb] = useState<File | null>(null);
    const [selectedVideoPreview, setSelectedVideoPreview] = useState<string | null>(null);
    const [selectedThumbPreview, setSelectedThumbPreview] = useState<string | null>(null);
    // @ts-ignore
    const [othent, setOthent] = useState<Othent | ''>('');
    const [user, setUser] = useState<any>();
    const [txId, setTxId] = useState('');
    const [txIdThumb, setTxIdThumb] = useState('');
    const [postData, setPostData] = useState<PostData>({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        wallet_address: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('postData:', postData);

        try {
            const response = await fetch('/api/uploadVideo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                router.push('/');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPostData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const initializeOthent = async () => {
            // @ts-ignore
            const othentInstance = await Othent({ API_ID: othnetAPI });
            setOthent(othentInstance);
        };
        initializeOthent();
    }, [othnetAPI]);

    async function logOut() {
        const logOutResponse = await othent!.logOut();
        setUser(null);
        setTxId('');
        console.log('logOut Response:', logOutResponse);
    }

    async function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        console.log('Uploaded file:', file);

        if (!file) return;

        const signedFile = await othent!.signTransactionBundlr({
            othentFunction: 'uploadData',
            data: file,
            tags: [{ name: "Content-Type", value: file.type }]
        });
        console.log('Signed file:', signedFile);

        const transaction = await othent!.sendTransactionBundlr(signedFile);
        console.log('Transaction', transaction);

        if (transaction.success) {
            setTxId(transaction.transactionId);

            const videoURL = `https://arweave.net/${transaction.transactionId}`;
            setPostData((prevData) => ({
                ...prevData,
                video_url: videoURL,
            }));
        }

        const selectedVideo = event.target.files?.[0];
        // @ts-ignore
        setVideo(selectedVideo);

        if (selectedVideo) {
            const videoURL = URL.createObjectURL(selectedVideo);
            setSelectedVideoPreview(videoURL);
        } else {
            setSelectedVideoPreview(null);
        }
    }

    async function uploadThumb(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        console.log('Uploaded file:', file);

        if (!file) return;

        const signedFile = await othent!.signTransactionBundlr({
            othentFunction: 'uploadData',
            data: file,
            tags: [{ name: "Content-Type", value: file.type }]
        });
        console.log('Signed file:', signedFile);

        const transaction = await othent!.sendTransactionBundlr(signedFile);
        console.log('Transaction', transaction);

        if (transaction.success) {
            setTxIdThumb(transaction.transactionId);

            const thumbnailURL = `https://arweave.net/${transaction.transactionId}`;
            setPostData((prevData) => ({
                ...prevData,
                thumbnail_url: thumbnailURL,
            }));
        }

        const selectedThumb = event.target.files?.[0];
        // @ts-ignore
        setThumb(selectedThumb);

        if (selectedThumb) {
            const ThumbURL = URL.createObjectURL(selectedThumb);
            setSelectedThumbPreview(ThumbURL);
        } else {
            setSelectedThumbPreview(null);
        }
    }

    useEffect(() => {
        const initializeOthent = async () => {
            try {
                // @ts-ignore
                const othentInstance = await Othent({ API_ID: othnetAPI });
                setOthent(othentInstance);
            } catch (error) {
                console.error("Error initializing Othent:", error);
            }
        };
        initializeOthent();
    }, [othnetAPI]);

    async function logIn() {
        try {
            if (othent) {
                const userDetails = await othent.logIn();
                setUser(userDetails);
                console.log('User details:', userDetails);
            } else {
                console.error("Othent instance is not initialized.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }

    return (
        <div className='grid place-items-center pb-20 pt-12'>
            <motion.div variants={fadeLogo} initial="hidden" animate="visible" className="grid place-items-center pb-4">
                <h1 className="text-3xl md:text-5xl text-center text-white font-semibold">Upload video</h1>
                <div className="bg-secondary w-52 h-1 my-2 rounded-md"></div>
            </motion.div>

            {!user ? (
                <div className="mt-36">
                    <button className='flex flex-row space-x-2 bg-white px-4 py-2 rounded-lg' onClick={logIn}>
                        <h1 className='text-xl pr-3'>Log In using Othent</h1>
                        <Image src="/118553412.png" alt="Othent" height={30} width={30} />
                    </button>
                </div>
            ) : (
                <div className="mx-8 md:mx-36 grid">

                    <div className=''>
                        <h1 className='text-center text-xl text-white'>Hello, {user.name}</h1>

                        <div className='float-right mr-4 py-4 space-y-2'>
                            <div className='flex flex-row items-center justify-center space-x-2 pt-2'>
                                <h1 className='text-center text-md text-white mr-2'>{user.email}</h1>
                                <Image src={user.picture} alt="avatar" className='mt-1 rounded-full' width={25} height={25} />
                            </div>
                            <button className='float-right bg-secondary text-[1rem] text-white px-2 py-1 rounded-md' onClick={logOut}>
                                Log Out
                            </button>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit} className="min-w-[70vw]  md:mx-4 p-8 bg-white rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold mb-4">Upload Video</h1>
                        <div className='grid md:flex'>
                            {/* Left Column */}
                            <div className="flex-1 md:pr-8">
                                <div className="mb-4 grid">
                                    <label htmlFor="video" className="block font-medium">
                                        Select Video:
                                    </label>
                                    <input
                                        type="file"
                                        id="video"
                                        accept="video/*"
                                        onChange={uploadFile}
                                        disabled={!user}
                                        required
                                    />
                                    <input type="text" className='hidden' name="video_url" value={postData.video_url} onChange={handleChange} placeholder="Video URL" />
                                </div>
                                {selectedVideoPreview && (
                                    <div className="mb-4">
                                        <video className="w-full rounded-xl" id="player" controls playsInline>
                                            <source src={selectedVideoPreview} type="video/mp4" />
                                        </video>
                                    </div>
                                )}
                                <div className="mb-4 grid">
                                    <label htmlFor="thumbnail_url" className="block font-medium">
                                        Select Thumbnail:
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={uploadThumb}
                                        disabled={!user}
                                        required
                                    />
                                    <input type="text"
                                        id="thumbnail_url"
                                        name="thumbnail_url"
                                        value={postData.thumbnail_url}
                                        onChange={handleChange}
                                        className='hidden'
                                        placeholder="Thumbnail URL" />

                                </div>
                                {selectedThumbPreview && (
                                    <div className="mb-4">
                                        <Image className="object-cover rounded-xl" alt='thumbnail' src={selectedThumbPreview} width={360} height={250} />
                                    </div>
                                )}
                            </div>
                            {/* Right Column */}
                            <div className="flex-1 md:pl-8">
                                <div className="mb-4">
                                    <label htmlFor="title" className="block font-medium">
                                        Title:
                                    </label>
                                    <input
                                        type="text"
                                        id="title" required
                                        name="title" value={postData.title} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block font-medium">
                                        Description:
                                    </label>
                                    <textarea
                                        id="description" required
                                        // @ts-ignore
                                        name="description" value={postData.description} onChange={handleChange}
                                        className="w-full min-h-[16rem] border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="title" className="block font-medium">
                                        Wallet Address:
                                    </label>
                                    <input
                                        type="text"
                                        id="walletAdd" required
                                        name="wallet_address" value={postData.wallet_address} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid place-items-center">
                            <button
                                type="submit"
                                className={`bg-secondary text-white px-4 py-2 rounded ${(!selectedVideoPreview || !selectedThumbPreview) && 'opacity-50 cursor-not-allowed'}`}
                                disabled={!selectedVideoPreview || !selectedThumbPreview}
                            >
                                Upload Video
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
