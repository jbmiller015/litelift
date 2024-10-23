'use client';
import exampleData from '/Example_Data.json'
import ExerciseList from "@/components/ExerciseList";
import React, {useState, useEffect} from 'react'
import {usePathname} from 'next/navigation'

/**
 type ExcerciseData = {
 name: string
 stargazers_count: number
 }

 export async function getStaticProps() {
 const res = await fetch('127.0.0.1:3000/api/exercise/')
 const exerciseData = await res.json()
 return {props: {exerciseData}}
 }*/

export default function Day(props) {
    const [exerciseData, setExerciseData] = useState(exampleData.filter((data) => {
        return data.name === props.params.lift.replaceAll('%20', ' ')
    })[0])
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
            let res = await fetch(`http://localhost:3000/api/day/${resource}`, {
                method: "GET",
                headers: {'Set-Cookie': document.cookie}
            })
            if (res.ok) {
                const data = await res.json();
                console.log(data)
                setExerciseData(data);
                setLoading(false);
            } else {
                const errorBody = await res.json();
                setError({status: res.status, statusText: res.statusText, data: errorBody});
                setLoading(false)
            }
        }

        fetchData()
    }, [])
    const pathname = usePathname()
    let resource = pathname.slice('/day/'.length);

    return (<div>
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
                <div className="text-center">
                    <h2 className="text-5xl my-4">{exerciseData.name}</h2>
                    <ExerciseList exerciseData={exerciseData.exerciseData}/>
                </div>
            )}
        </div>
    );
}
