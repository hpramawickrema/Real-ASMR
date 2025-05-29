import React from 'react';
import { motion } from 'framer-motion';
import UserNavigation from "./usernav";
import Navigation from './navigation';
import ArticlePreviewList from "./ArticlePreviewList";

export default function HomePage() {
    return (
        <><Navigation/>
            <div className="bg-gray-50">
                {/* Hero Section */}
                <section className="bg-indigo-600 text-white">
                    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                        <motion.h1
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.7}}
                            className="text-4xl sm:text-5xl font-extrabold leading-tight"
                        >
                            Relax, Unwind, and Feel the Tingles with ASMR
                        </motion.h1>
                        <p className="mt-4 text-lg text-indigo-200">
                            Explore the largest collection of ASMR experiences crafted to calm your mind.
                        </p>
                        <motion.a
                            href="/view"
                            whileHover={{scale: 1.05}}
                            className="inline-block mt-8 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-md shadow-md hover:bg-gray-100 transition"
                        >
                            Explore Videos
                        </motion.a>
                    </div>
                </section>

                {/* What is ASMR Section */}
                <section className="max-w-6xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">What is ASMR?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            ASMR (Autonomous Sensory Meridian Response) is a relaxing, often sedative sensation
                            that begins on the scalp and moves down the body. It is triggered by placid sights and
                            sounds
                            such as whispers, accents, and crackles.
                        </p>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="bg-white py-16">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
                        <div>
                            <img src="/icons/relax.svg" alt="Relaxation" className="mx-auto w-20 mb-4"/>
                            <h3 className="text-xl font-semibold text-gray-700">Deep Relaxation</h3>
                            <p className="text-gray-500 mt-2">Feel your stress melt away with soothing sounds and
                                visuals.</p>
                        </div>
                        <div>
                            <img src="/icons/sleep.svg" alt="Better Sleep" className="mx-auto w-20 mb-4"/>
                            <h3 className="text-xl font-semibold text-gray-700">Better Sleep</h3>
                            <p className="text-gray-500 mt-2">Fall asleep faster and wake up refreshed with gentle ASMR
                                therapy.</p>
                        </div>
                        <div>
                            <img src="/icons/focus.svg" alt="Focus" className="mx-auto w-20 mb-4"/>
                            <h3 className="text-xl font-semibold text-gray-700">Enhanced Focus</h3>
                            <p className="text-gray-500 mt-2">Stay focused and productive with calming background ASMR
                                sounds.</p>
                        </div>
                    </div>
                </section>

                {/* Featured Videos */}
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Videos</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Example video thumbnails */}
                            {[1, 2, 3].map((item) => (
                                <motion.div
                                    key={item}
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.5, delay: item * 0.2}}
                                    className="bg-white rounded-md shadow hover:shadow-lg overflow-hidden transition"
                                >
                                    <img
                                        src={`/sample-video-cover-${item}.jpg`}
                                        alt={`Featured ASMR ${item}`}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-700">Calming ASMR Session #{item}</h3>
                                        <p className="text-sm text-gray-500 mt-2">Relax and let your mind drift...</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                <ArticlePreviewList />

                {/* Newsletter Signup */}
                <section className="bg-indigo-100 py-16">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Newsletter</h2>
                        <p className="text-gray-600 mb-8">
                            Get weekly ASMR videos, tips for better sleep, and relaxation delivered to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 justify-center">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="p-3 rounded-md border border-gray-300 w-full sm:w-80 focus:ring focus:ring-indigo-300"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold transition"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-indigo-600 text-white py-6 mt-12">
                    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                        <span>&copy; {new Date().getFullYear()} ASMR World. All rights reserved.</span>
                        <div className="flex gap-4">
                            <a href="/privacy" className="hover:underline">Privacy</a>
                            <a href="/terms" className="hover:underline">Terms</a>
                        </div>
                    </div>
                </footer>
            </div>

        </>
    );
}
