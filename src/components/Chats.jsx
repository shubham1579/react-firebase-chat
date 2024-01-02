import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {

    const [chats, setChats] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);


    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };
    
    return (
        <div>
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (

                <div 
                    className='flex items-center p-[10px] gap-[10px] text-white cursor-pointer hover:bg-[#2f2d52]'
                    key={chat[0]}
                    onClick={() => handleSelect(chat[1].userInfo)}
                >
                    <img 
                        src={chat[1].userInfo.photoURL}
                        alt="" 
                        className='w-12 h-12 rounded-[50%] object-cover'
                        />
                    <div>
                        <span className='text-base font-medium'>{chat[1].userInfo.displayName}</span>
                        <p className='text-xs text-slate-400'>{chat[1].lastMessage?.text}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats;