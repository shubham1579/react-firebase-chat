import React from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

const Home = () => {

    return (
        <div className='flex items-center justify-center h-screen bg-[#a7bcff]'>
            <div className='border border-white rounded-xl sm:mx-auto sm:w-full sm:max-w-5xl sm:h-4/5 flex overflow-hidden'>
                <Sidebar />
                <Chat />
            </div>
        </div>
    )
}

export default Home;