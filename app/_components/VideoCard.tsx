import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CardProps {
    videoUrl: string;
    imageSrc: string;
    title: string;
    description?: string;
}

const VideoCard: React.FC<CardProps> = ({ videoUrl, imageSrc, title, description }) => {
    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const truncatedDescription = (description ?? '').split(' ').slice(0, 15).join(' ');

    useEffect(() => {
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;

        videoElement.addEventListener('loadedmetadata', () => {
            setVideoDuration(videoElement.duration);
        });

        return () => {
            videoElement.removeEventListener('loadedmetadata', () => { });
        };
    }, [videoUrl]);

    return (
        <div className="cursor-pointer rounded-xl overflow-hidden bg-white shadow-lg">
            <img className="object-cover" src={imageSrc} alt={title} width={360} height={100} />
            <div className="px-4 py-2">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-gray-800 text-base">
                    {truncatedDescription}
                </p>
                {videoDuration !== null && (
                    <p className="text-gray-600">Duration: {videoDuration.toFixed(2)} seconds</p>
                )}
            </div>
        </div>
    );
};

export default VideoCard;
