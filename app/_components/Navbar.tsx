"use client"

import React, { useState } from 'react'
import Link from 'next/link';
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { motion } from "framer-motion"
import { fadeNav } from "../animation"
export default function Navbar() {

    const [showNavbar, setShowNavbar] = useState(false);

    return (
        <motion.div variants={fadeNav} initial="hidden" animate="visible" className="z-50 w-full">
            <nav className="flex items-center bg-primary py-2 flex-wrap px-4 tracking-wider">
                <Link href="/" passHref><span className="p-2 mr-4 inline-flex items-center text-2xl md:text-5xl cursor-pointer font-base text-white">StreamWeave
                </span></Link>

                <button className="lg:hidden right-0 absolute md:px-8 px-6 mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => setShowNavbar(true)} aria-hidden="false" aria-label="button">
                    <HiOutlineMenuAlt3 className="h-7 w-7 text-white" aria-hidden="false" />
                </button>
                {showNavbar ? (
                    <div>
                        <div className=" flex overflow-x-hidden mx-4 md:mx-8 h-screen overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none lg:hidden"
                        >
                            <div className="relative my-4 mx-auto w-screen">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-900 outline-none focus:outline-none text-white">
                                    <div className="flex items-start justify-between p-5 border-solid rounded-t">
                                        <Link href="/" passHref>
                                            <div className="text-2xl font-base tracking-wide cursor-pointer">
                                                StreamWeave
                                            </div>
                                        </Link>

                                        <button className="absolute right-6" onClick={() => setShowNavbar(false)} aria-hidden="false" aria-label="button">
                                            <HiX className="h-7 w-7" aria-hidden="false" />
                                        </button>

                                    </div>

                                    <div className="grid justify-center">
                                        <div className="inline-flex w-64 h-1 bg-indigo-500 rounded-full"></div>
                                    </div>

                                    <div className="grid place-items-center text-xl py-2 gap-2 w-full mb-4">

                                        <Link href="/" passHref onClick={() => setShowNavbar(false)}>
                                            <span className="lg:inline-flex px-3 mx-3 py-2 rounded items-center justify-center hover:bg-secondary cursor-pointer text-white">Home</span>
                                        </Link>

                                        <Link href="/upload" passHref onClick={() => setShowNavbar(false)}>
                                            <span className="lg:inline-flex px-3 mx-3 py-2 rounded items-center justify-center hover:bg-secondary cursor-pointer text-white">Upload Video</span>
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="opacity-25 fixed inset-0 z-40 h-screen bg-black md:hidden"></div>
                    </div>
                ) : null}

                <div className="hidden top-navbar w-full lg:inline-flex lg:flex-grow lg:w-auto" >
                    <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full text-xl lg:items-center items-start flex flex-col lg:h-auto space-x-2 mr-12" >

                        <Link href="/" passHref>
                            <span className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded items-center justify-center hover:bg-secondary cursor-pointer text-white">Home</span>
                        </Link>

                        <Link href="/upload" passHref>
                            <span className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded items-center justify-center hover:bg-secondary cursor-pointer text-white">Upload Video</span>
                        </Link>

                    </div>
                </div>
            </nav>
        </motion.div>
    )
}