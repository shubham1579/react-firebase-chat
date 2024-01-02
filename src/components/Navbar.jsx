import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {

    const { currentUser } = useContext(AuthContext);

    return (
        <div className='flex justify-between items-center text-[#ddddf7] bg-[#2f2d52] h-16 p-3'>
            <span className='font-bold'>React chat</span>
            <div className='flex items-center gap-[10px]'>
                <img src={currentUser.photoURL} alt="" className='bg-[#ddddf7] h-6 w-6 rounded-[50%] object-cover' />
                <span>{currentUser.displayName}</span>
                <button 
                    onClick={() => signOut(auth)}
                    className='bg-[#5d5b8d] text-[#ddddf7] text-xs px-1.5 py-1 border-none rounded-sm'
                >
                    logout
                </button>
            </div>
        </div>
    )
    // "https://media.gettyimages.com/id/1472909629/photo/india-v-australia-4th-test-day-4.jpg?s=2048x2048&w=gi&k=20&c=EqyWSvuNLf5DtxKZUL89IL02XMQe9zSNoiPuFpRv5yQ="
}

export default Navbar;