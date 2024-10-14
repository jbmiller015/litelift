import React, {useEffect, useState} from "react";
import {router} from "next/client";
import logo from "@/assets/images/weight-1-svgrepo-com.png";
import Image from "next/image";


const AuthForm = () => {
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        confirmPass: ''
    });
    const [signup, setSignup] = useState(false);
    const [path, setPath] = useState('login');
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        signup ? setPath('signup') : setPath('login');
        setAuthData({
            ...authData,
            email: '',
            password: '',
            confirmPass: ''
        })
    }, [signup])


    const validate = () => {
        if (authData.email === '') {
            setError({status: 'Missing Field', statusText: 'Please provide email'})
            return true
        }

        if (authData.password === '') {
            setError({status: 'Missing Field', statusText: 'Please provide password'})
            return true
        }

        if (signup && authData.confirmPass !== authData.password) {
            setError({status: 'Passwords do not match', statusText: 'Please try again'})
            setAuthData({
                ...authData,
                confirmPass: ''
            })
            return true
        }

        return false
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitError = validate()

        if (!submitError) {
            setLoading(true);
            await fetch(`/api/auth/${path}`, {
                method: "POST",
                body: JSON.stringify({...authData})
            })
                .then(res => {
                    setLoading(false);
                    router.push('/');
                })
                .catch(err => {
                    setError(err.response);
                    setLoading(false)
                });
        }

    }

    return (
        <div className="flex flex-col justify-center items-center p-4 md:p-12">
            <h2 className="text-7xl py-5">LiteLift</h2>
            <div className="bg-clip-content p-4 dark:border-gray-500 border-gray-500 border-4 border-dashed rounded-full">
            <Image src={logo} alt="heroLogo" height="200" width="200"/>
                </div>
            <div className="my-4 border-b border-gray-300"/>
            {
                Object.keys(error).length !== 0 ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className="absolute top-0 right-0 p-2" onClick={() => setError({})}>Close
                            </span>
                        <div className="font-bold">{error.status + ": " + error.statusText}</div>
                        <div><p>{error.data}</p></div>
                    </div>
                ) : null
            }

            {loading ? (
                <div className="flex justify-center items-center w-full h-40">
                    <div className="text-lg font-bold text-gray-700">Loading</div>
                </div>
            ) : (
                <div>
                    <form className="space-y-4">
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="text"
                                        placeholder="Username"
                                        value={authData.email}
                                        autoCapitalize="none"
                                        autoCorrect="false"
                                        onChange={e => setAuthData({...authData, email: e.target.value})}
                                        className="pl-10 p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={authData.password}
                                        autoCapitalize="none"
                                        autoCorrect="false"
                                        onChange={e => setAuthData({...authData, password: e.target.value})}
                                        className="pl-10 p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {signup && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2"
                                           htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={authData.confirmPass}
                                            autoCapitalize="none"
                                            autoCorrect="false"
                                            onChange={e => setAuthData({...authData, confirmPass: e.target.value})}
                                            className="pl-10 p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={handleSubmit}>
                            {path === 'login' ? "Log In" : "Sign Up"}
                        </button>
                    </form>
                    <div className="mt-6 text-center text-gray-600">
                        {path === 'login' ? "New to us? " : "Already have an account? "}
                        <a href="#" onClick={() => path === 'login' ? setSignup(true) : setSignup(false)}
                           className="text-blue-500 hover:text-blue-700">
                            {path === 'login' ? "Sign Up" : "Log In"}
                        </a>
                    </div>
                    <div className="mt-2 text-center text-gray-600">
                        {"Wanna take a look around? Check out the "}
                        <a href="/"
                           className="text-blue-500 hover:text-blue-700">
                            demo
                        </a>
                        {"."}
                    </div>
                </div>
            )}
        </div>
    );

};


export default AuthForm;
