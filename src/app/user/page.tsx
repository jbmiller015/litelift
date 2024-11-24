'use client'

import React from "react";
import {useRouter} from "next/navigation";

export default function User() {
    const router = useRouter();

    const doLogout = () => {
        document.cookie = 'token' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push(`/welcome`);
    }

    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">User</h2>
        <div onClick={doLogout}
             className="btn text-2xl m-2 w-100 border border-amber-400 rounded-lg h-20 text-center text-amber-400 bg-transparent hover:bg-amber-100 hover:text-amber-900 cursor-pointer flex flex-col items-center justify-center">
            <h4>Log Out</h4>
        </div>

    </div>);

}
