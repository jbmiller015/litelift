import React, {useEffect, useState} from "react";
import {useRouter} from 'next/navigation'
import logo from "@/assets/images/weight-1-svgrepo-com.png";
import Image from "next/image";
import Link from "next/link";


const AuthForm = () => {
    const [authData, setAuthData] = useState({
        name: '',
        password: '',
        confirmPass: ''
    });
    const [signup, setSignup] = useState(false);
    const [path, setPath] = useState('login');
    const [error, setError] = useState<({
        status?: string | number | undefined,
        statusText?: string | undefined,
        data?: string | undefined
    } | undefined)>(undefined);
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        signup ? setPath('signup') : setPath('login');
        setAuthData({
            ...authData,
            name: '',
            password: '',
            confirmPass: ''
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signup])


    const validate = () => {
        if (authData.name === '') {
            setError((prev) => {
                    return {...prev, status: 'Missing Field', statusText: 'Please provide login name'}
                }
            )
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

    const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const submitError = validate()

        if (!submitError) {
            const base = process.env.NEXT_PUBLIC_BASE_URL;
            if (!base) {
                throw new Error("Base URL not set in environment variables");
            }
            setLoading(true);
            const bodyVal = JSON.stringify({...authData});
            const res = await fetch(`${base}/api/auth/${path}`, {
                method: "POST",
                body: bodyVal
            })
            if (res.ok) {
                router.push(`${base}/exercises`);
            } else {
                const errorBody = await res.json();
                setError({status: res.status, statusText: res.statusText, data: errorBody});
                setLoading(false)
            }
        }

    }

    return (
        <div className="flex flex-col justify-center items-center p-4 md:p-12">
            <h2 className="text-7xl py-5">Lite-Lift</h2>
            <div
                className="bg-clip-content p-4 dark:border-gray-500 border-gray-500 border-4 border-dashed rounded-full">
                <Image src={logo} alt="heroLogo" height="200" width="200"/>
            </div>
            <div className="my-4 border-b border-gray-300"/>
            {
                error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                 <span className="absolute top-0 right-0 p-2" onClick={() => setError(undefined)}>Close
                 </span>
                        <div
                            className="font-bold">{error?.status ? error.status : "" + ": " + error.statusText}</div>
                        <div><p>{error.data}</p></div>
                    </div>
                ) : null
                /* eslint-enable no-alert */
            }

            {loading ? (
                <div className="flex justify-center items-center w-full h-40">
                    <div className="text-lg font-bold text-gray-700">Loading</div>
                </div>
            ) : (
                <div>
                    <form className="space-y-4">
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-black">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Username"
                                        value={authData.name}
                                        autoCapitalize="none"
                                        autoCorrect="false"
                                        onChange={e => setAuthData({...authData, name: e.target.value})}
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
                        <Link href="/"
                              className="text-blue-500 hover:text-blue-700">
                            demo
                        </Link>
                        {"."}
                    </div>
                </div>
            )}
        </div>
    );

};


export default AuthForm;
