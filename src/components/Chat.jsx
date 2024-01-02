import React, { useContext } from 'react';
import Cam from '../images/cam.png';
import Add from '../images/add.png';
import More from '../images/more.png';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {

    const { data } = useContext(ChatContext);

    return (
        <div className='flex-[2]'>
            <div className='flex items-center justify-between h-16 p-3 bg-[#3e3c61]'>
                <span className='text-slate-200'>{data.user?.displayName}</span>
                <div className='flex gap-[10px]'>
                    <img src={Cam} alt="" className='h-6 w-6 cursor-pointer' />
                    <img src={Add} alt="" className='h-6 w-6 cursor-pointer' />
                    <img src={More} alt="" className='h-6 w-6 cursor-pointer' />
                </div>
            </div>
            <Messages />
            <Input />
        </div>
    )
}

export default Chat;