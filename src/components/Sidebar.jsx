import React from 'react';
import Navbar from './Navbar';
import Searchbar from './Searchbar';
import Chats from './Chats';

const Sidebar = () => {


    return (
        <div className='flex-1 border border-[#3e3c61] bg-[#3e3c61]'>
            <Navbar />
            <Searchbar />
            <Chats />
        </div>
    )
}

export default Sidebar;