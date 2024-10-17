import exampleData from "/Example_Data.json";
import Day from "@/components/Day";
import {redirect} from 'next/navigation'
import {cookies} from 'next/headers'
import {Suspense} from "react";

export default async function Home() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    let exerciseData: any[] = exampleData;
    const showDays = () => {
        return exerciseData.map((day, i) => <div key={`day${i}`}><Day exerciseData={day}/></div>)
    }
    if (!token) {
        redirect('/welcome');
    } else {
        const res = await fetch('http://localhost:3000/api/day/', {
            method: "GET",
            headers: {'cookie': `token=${token}`}
        })
        if (res.ok) {
            const data = await res.json();
            exerciseData = data;
        } else {
            const errorBody = await res.json();
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
