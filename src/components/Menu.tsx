'use client'
import Link from "next/link";
import Home_Icon from "@/assets/icon/home_icon";
import User_Icon from "@/assets/icon/user_icon";
import Edit_Icon from "@/assets/icon/edit_icon";
import Settings_Icon from "@/assets/icon/settings_icon";
import {usePathname} from 'next/navigation';

export default function Menu() {
    const pathname = usePathname();
    console.log(pathname)
    let viewName = ''
    if (pathname.startsWith('/day/')) {
        viewName = pathname.slice('/day/'.length);
        console.log(viewName)
    }
    if(pathname.startsWith('/welcome'))
        return null;
    return (<div className="w-100 h-14 border rounded-lg m-2 flex flex-row items-center justify-between">
            <Link href={'/'}>
                <div
                    className="btn w-14 h-full bg-gray-200 dark:bg-transparent rounded text-black dark:text-white text-center">
                    <Home_Icon/></div>
            </Link>
            <Link href={'/user'}>
                <div
                    className="btn w-14 h-full bg-gray-200 dark:bg-transparent rounded text-black dark:text-white text-center">
                    <User_Icon/></div>
            </Link>
            <Link href={`/edit/${viewName}`}>
                <div
                    className="btn w-14 h-full bg-gray-200 dark:bg-transparent rounded text-black dark:text-white text-center">
                    <Edit_Icon/></div>
            </Link>
            <Link href={'/settings'}>
                <div
                    className="btn w-14 h-full bg-gray-200 dark:bg-transparent rounded text-black dark:text-white text-center">
                    <Settings_Icon/>
                </div>
            </Link>
        </div>
    )
}
