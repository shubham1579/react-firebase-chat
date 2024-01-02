import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Add from '../images/addAvatar.png';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({mode: "all"});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {

        try {
            //Create user
            const res = await createUserWithEmailAndPassword(auth, data.email, data.password);

            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${data.username + date}`);

            await uploadBytesResumable(storageRef, data.avatar[0])
            .then(() => {
                getDownloadURL(storageRef)
                .then(async (downloadURL) => {
                    try {
                        //Update profile
                        await updateProfile(res.user, {
                            displayName: data.username,
                            photoURL: downloadURL,
                        });
                        //create user on firestore
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName: data.username,
                            email: data.email,
                            photoURL: downloadURL,
                        });

                        //create empty user chats on firestore
                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");
                    } 
                    catch (err) {
                        console.log(err);
                        setError(true);
                        setLoading(false);
                    }
                });
            });
        } 
        catch (err) {
            setError(true);
            setLoading(false);
        }
        reset();

    }

    return (
        <div className="flex h-screen bg-[#a7bcff] flex-1 flex-col justify-center px-6 py-8 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-white px-8 py-10 rounded-xl">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create a New Account
                    </h2>
                </div>
                <form noValidate
                    className="space-y-4"
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="username" className="block text-md font-medium leading-6 text-gray-900">
                                User name
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="username"
                                {...register('username', {
                                    required: 'Username is required',
                                })}
                                type="text"
                                placeholder="Enter user name"
                                className="block w-full rounded-md border-0 outline-none p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <p className="text-sm text-red-600">{errors.name?.message}</p>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-md font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                                        message: 'Email is not valid'
                                    },
                                })}
                                type="email"
                                className="block w-full rounded-md border-0 outline-none p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Enter your email"
                            />
                        </div>
                        <p className="text-sm text-red-600">{errors.email?.message}</p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-md font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    pattern: {
                                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                        message: `at least 8 characters | must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number | Can contain special characters`
                                    },
                                })}
                                type="password"
                                placeholder="Enter password"
                                className="block w-full rounded-md border-0 outline-none p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <p className="text-sm text-red-600">{errors.password?.message}</p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="avatar" className="flex items-center cursor-pointer">
                                <img src={Add} alt="Avatar" className='w-10' />
                                <span className='ml-2 text-[#8da4f1] text-sm'>Add an avatar</span>
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="avatar"
                                type="file"
                                name="avatar"
                                {...register('avatar', {
                                    required: 'Avatar is required',
                                })}
                                className="hidden"
                            />
                        </div>
                        <p className="text-sm text-red-600">{errors.confirmPassword?.message}</p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign Up
                        </button>
                    </div>
                    {error && <span className='text-red-500'>Something went wrong..</span>}
                </form>

                <p className="mt-3 text-center text-sm text-gray-500">
                    Already a member?{' '}
                    <Link to={'/login'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register;