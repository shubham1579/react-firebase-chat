import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Searchbar = () => {

    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } 
        catch (err) {
            setError(true);
        }
    }

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    }

    const handleSelect = async () => {
        //check whether the group(chats in firestore) exists, if not create
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                //create a chat in chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                //create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        }
        catch (err) { }

        setUser(null);
        setUsername("")
    }
    
    return (
        <div className='border border-gray-500'>
            <div className='p-[10px]'>
                <input 
                    type="text" 
                    className='bg-transparent border-none text-white outline-none' 
                    placeholder='find a user'
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKey}
                    value={username}
                />
            </div>
            {error && <span className='text-red-500'>User not found!</span>}
            {user && (
                <div 
                    className='flex items-center p-[10px] gap-[10px] text-white cursor-pointer hover:bg-[#2f2d52]'
                    onClick={handleSelect}
                >
                    <img 
                        src={user.photoURL}
                        alt="" 
                        className='w-12 h-12 rounded-[50%] object-cover'
                    />
                    <div>
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Searchbar;