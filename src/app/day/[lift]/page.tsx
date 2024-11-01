'use client';
import exampleData from '/Example_Data.json'
import ExerciseList from "@/components/ExerciseList";
import React, {useState, useEffect} from 'react'
import {usePathname} from 'next/navigation'
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
    const {exerciseData, loading, error, submitExerciseData} = useExerciseContext();

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
            <h2 className="text-5xl my-4">{exerciseData?.name}</h2>
            <ExerciseList/>
        </div>
    );
}
