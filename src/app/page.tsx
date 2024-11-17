import Day from "@/components/Day";
import {redirect} from 'next/navigation'
import {cookies} from 'next/headers'
import {Suspense} from "react";
import {ObjectId} from "bson";


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
        <h2 className="text-5xl border-b-2 my-4">Lifts</h2>
        <Suspense fallback={<p>Loading...</p>}>
            {showDays()}
        </Suspense>
    </div>);

}
