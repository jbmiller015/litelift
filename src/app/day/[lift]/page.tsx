'use client';
import ExerciseList from "@/components/ExerciseList";
import React, {useEffect} from 'react'
import {ExerciseProvider, useExerciseContext} from "@/context/ExerciseContext";
import Plus_Icon from "@/assets/icon/plus_icon";
import Link from "next/link";

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
            <div className="flex flex-row w-full align-center justify-center relative border-b-2">
                {exerciseData?.exerciseData.length > 0 ? <div onClick={() => resetWRStatus()}
                                                              className="btn w-14 mt-4 absolute left-2 border-2 border-amber-400 rounded-lg h-12 text-center text-amber-800 dark:text-amber-100 bg-transparent hover:bg-amber-100 hover:text-amber-900 cursor-pointer flex flex-col items-center justify-center">
                    <h2 className="text-1xl">Reset</h2>
                </div> : null}
                <h2 className="text-4xl my-4">{exerciseData?.name}</h2>
            </div>
            {exerciseData?.exerciseData.length > 0 ? <><ExerciseList/>
                <div onClick={() => saveOnExit()}
                     className="btn m-2 mt-24 w-100 border-2 border-green-400 rounded-lg h-20 text-center text-green-800 dark:text-green-100 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
                    <h2 className="text-3xl">Save & Exit</h2>
                </div>
            </> : <Link href={`/edit/${exerciseData?.name}`}>
                <div
                    className="btn text-2xl m-2 w-100 border border-green-400 rounded-lg h-20 text-center text-green-400 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
                    <Plus_Icon/>
                </div>
            </Link>}
        </div>

    );
}
