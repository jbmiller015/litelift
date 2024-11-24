import Day from "@/components/Day";
import {redirect} from 'next/navigation'
import {cookies} from 'next/headers'
import {Suspense} from "react";
import {ObjectId} from "bson";
import Plus_Icon from "@/assets/icon/plus_icon";
import Link from "next/link";


interface ExData {
    exerciseData: ObjectId[];
    name: string;
    user_id: ObjectId;
    _id: ObjectId;
}

export default async function Home() {
    let token;
    try {
        const cookieStore = cookies();
        token = cookieStore.get('token')?.value;
    } catch (err) {
        console.log(err)
    }

    let exerciseData: ExData[] = [];
    const showDays = () => {
        if (exerciseData.length === 0) {
            return (
                <Link href={`/edit/`}>
                    <div
                        className="btn text-2xl m-2 w-100 border border-green-400 rounded-lg h-20 text-center text-green-400 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
                        <Plus_Icon/>
                    </div>
                </Link>)
        }
        return exerciseData.map((day: ExData, i) => <div key={`day${i}`}><Day exerciseData={day}/></div>)
    }
    if (!token) {
        redirect('/welcome');
    } else {
        const base = process.env.NEXT_PUBLIC_BASE_URL;
        if (!base) {
            throw new Error("Base URL not set in environment variables");
        }
        const res = await fetch(`${base}/api/day/`, {
            method: "GET",
            headers: {'cookie': `token=${token}`}
        })
        if (res.ok) {
            const data = await res.json();
            exerciseData = data;
        } else {
            const errorBody = await res.json();
            console.log(errorBody)
            //setError({status: res.status, statusText: res.statusText, data: errorBody});
            //setLoading(false)
        }
    }
    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">Workouts</h2>
        <Suspense fallback={<p>Loading...</p>}>
            {showDays()}
        </Suspense>
    </div>);

}
