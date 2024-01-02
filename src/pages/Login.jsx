import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Login = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: "all" });
    const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            navigate("/");
        } 
        catch (err) {
            setError(true);
        }
        reset();

    }


    return (
        <div className="flex h-screen bg-[#a7bcff] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-white px-8 py-10 rounded-xl">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form noValidate className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
                                placeholder="Enter Your email"
                                className="block w-full rounded-md border-0 outline-none p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <p className="text-sm text-red-600">{errors.email?.message}</p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            {/* <div className="text-sm">
                                <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </Link>
                            </div> */}
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    pattern: {
                                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                        message: `- at least 8 characters\n
                                                - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
                                                - Can contain special characters`
                                    },
                                })}
                                type="password"
                                placeholder="Enter password"
                                className="block w-full rounded-md border-0 outline-none p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                    {error && <span className='text-red-500'>Something went wrong...</span>}
                </form>

                <p className="mt-3 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link to={'/register'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Create New Account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;