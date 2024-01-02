import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    
    return (
        <div ref={ref} className={`flex gap-5 mb-5 ${message.senderId === currentUser.uid ? 'flex-row-reverse' : ''}`}>
            <div>
                <img 
                    src={
                        message.senderId === currentUser.uid
                        ? currentUser.photoURL
                        : data.user.photoURL
                    }
                    alt="" 
                    className='w-8 h-8 object-cover rounded-[50%]'
                />
                <span className='text-slate-500 font-light'>just now</span>
            </div>
            <div className={`max-w-[80%] flex flex-col gap-[10px] ${message.senderId === currentUser.uid ? 'items-end' : ''}`}>
                {message.text && (
                    <p 
                        className={`p-[10px] max-w-max ${message.senderId === currentUser.uid ? 'bg-[#8da4f1] text-white rounded-tr-none rounded-l-xl rounded-br-xl' : 'bg-white rounded-l-none rounded-bl-xl rounded-r-xl'}`}
                    >
                        {message.text}
                    </p>
                )}
                {message.img && (
                    <img 
                        src={message.img} 
                        alt="" 
                        className='w-48 h-60 object-cover'
                    />
                )}
            </div>
        </div>
    )
}

export default Message;