// app/edit/[day]/page.tsx

'use client';
import {useEffect} from 'react';
import {ExerciseProvider, useExerciseContext} from '@/context/ExerciseContext';
import EditExerciseList from '@/components/EditExerciseList';

export default function EditDay() {
    return (
        <ExerciseProvider>
            <EditDayContent/>
        </ExerciseProvider>
    );
}

function EditDayContent() {
    const {exerciseData, loading, error, submitExerciseData} = useExerciseContext();

    useEffect(() => {
        if (!loading && !exerciseData) {
            console.log('No data loaded');
        }
    }, [loading, exerciseData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;
    if (!exerciseData) return <p>No profile data</p>;

    console.log(exerciseData)
    return (
        <div className="text-center">
            <h2 className="text-4xl border-b-2 my-4 text-wrap">Edit {exerciseData?.name}</h2>
            <EditExerciseList/>
            <div
                onClick={submitExerciseData}
                className="btn m-2 w-100 border border-gray-400 rounded-lg h-20 text-center text-gray-900 bg-green-400 hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
                <h2 className="text-3xl">Done</h2>
            </div>
        </div>
    );
}
