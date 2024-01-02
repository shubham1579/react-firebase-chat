import React, { useContext, useState } from 'react';
import Img from '../images/img.png';
import Attach from '../images/attach.png';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';
import { v4 as uuid } from "uuid";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

const Input = () => {
    
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                (error) => {
                    //TODO:Handle Error
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                            }),
                        });
                    });
                }
            );
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                }),
            });
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        setText("");
        setImg(null);
    };
    
    return (
        <div className='flex items-center justify-between h-16 p-3 bg-white'>
            <input 
                type="text" 
                placeholder='Type your message...'
                className='w-4/5 border-none outline-none'
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
            <div className='flex items-center w-1/5 gap-[10px]'>
                <img src={Attach} alt="" className='h-6 w-6 cursor-pointer' />
                <input type="file" id="file" className='hidden' onChange={(e) => setImg(e.target.files[0])} />
                <label htmlFor="file">
                    <img src={Img} alt="" className='h-6 w-6 cursor-pointer' />
                </label>
                <button 
                    className={`border-none p-2 text-white bg-[#8da4f1] ${text.length <= 0 ? 'cursor-not-allowed' : ''}`} 
                    disabled={text.length <= 0} 
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default Input;