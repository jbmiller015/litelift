'use client';
import ExerciseList from "@/components/ExerciseList";
import React, {useEffect} from 'react'
import {ExerciseProvider, useExerciseContext} from "@/context/ExerciseContext";

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

export default function Day() {
    return (
        <ExerciseProvider>
            <DayContent/>
        </ExerciseProvider>
    )
}

function DayContent() {
    const {exerciseData, loading, error, saveOnExit, resetWRStatus} = useExerciseContext();

    useEffect(() => {
        if (!loading && !exerciseData) {
            console.log('No data loaded');
        }
    }, [loading, exerciseData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;
    if (!exerciseData) return <p>No profile data</p>;

    return (
        <div className="text-center">
            <div className="flex flex-row w-full align-center justify-center relative">
                <div onClick={() => resetWRStatus()}
                     className="btn w-14 mt-4 absolute left-2 border-2 border-amber-400 rounded-lg h-12 text-center text-amber-800 dark:text-amber-100 bg-transparent hover:bg-amber-100 hover:text-amber-900 cursor-pointer flex flex-col items-center justify-center">
                    <h2 className="text-1xl">Reset</h2>
                </div>
                <h2 className="text-5xl my-4">{exerciseData?.name}</h2>
            </div>
            <ExerciseList/>
            <div onClick={() => saveOnExit()}
                 className="btn m-2 mt-24 w-100 border-2 border-green-400 rounded-lg h-20 text-center text-green-800 dark:text-green-100 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
                <h2 className="text-3xl">Save & Exit</h2>
            </div>
        </div>

    );
}
