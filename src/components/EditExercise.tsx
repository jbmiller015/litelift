import React, {useEffect, useState} from 'react';
import EditWeight from '@/components/EditWeight';
import Cross_Icon from "@/assets/icon/cross_icon";
import {useExerciseContext} from '@/context/ExerciseContext';
import {Exercise} from '@/context/ExerciseContext';
import Plus_Icon from "@/assets/icon/plus_icon";

interface EditExerciseProps {
    exercise: Exercise;
    deleteExercise: () => void;
}

export default function EditExercise({exercise, deleteExercise}: EditExerciseProps) {
    const {updateWeightReps, addWeightReps, deleteWeightReps, editExerciseProp} = useExerciseContext();
    const [exerciseName, setExerciseName] = useState(exercise.name);

    const handleNameChange = (name: string) => {
        setExerciseName(name);
        editExerciseProp(exercise._id, 'exerciseName', name);
    };
    useEffect(() => {
        setExerciseName(exercise.name);
    }, [exercise.name]);

    const showWeight = () => {
        let result = exercise.w_r.map((wr, i) => wr !== null ?
            <div key={`editWeight${i + exerciseName}`}>
                <EditWeight index={i} weight={wr.weight} reps={wr.reps} editWR={(newVal, valueType) => {
                    updateWeightReps(exercise._id, i, newVal, valueType);
                }} deleteWR={() => {
                    deleteWeightReps(exercise._id, i);
                }}/>
            </div> : null
        )
        result.push(<div key={`addWeightsReps${exerciseName}`}
                         className="relative flex items-center max-w-[11rem] min-w-[10rem]">
            <div type="button" id="decrement-button" onClick={() => addWeightReps(exercise._id)}
                 className="btn m-2 w-100 border border-green-400 rounded-lg text-center text-green-400
                 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center h-20 w-[11rem]">
                <Plus_Icon/>
            </div>
        </div>)
        return result;
    }


    return (
        <div className="p-2 m-2 border border-gray-300 rounded">
            <div className="flex items-stretch w-100 justify-center mb-4">
                <div onClick={(e) => deleteExercise()}
                     className="btn mv-2 absolute left-4 w-10 border border-red-400 rounded-lg text-center text-red-400 bg-transparent hover:bg-red-100 hover:text-red-900 dark:text-red-400 cursor-pointer flex flex-col items-center justify-center h-10">
                    <Cross_Icon/>
                </div>
                <input key={`EditTextLift${exercise._id}`}
                       className="justify-self-center border rounded-lg text-center text-4xl font-bold dark:text-white pb-2 bg-transparent w-3/4 md:w-min"
                       placeholder={"Exercise Name"}
                       value={exerciseName}
                       onChange={(e) => handleNameChange(e.target.value)}/>
            </div>
            <div className="flex flew-col flex-wrap gap-2 justify-center">{showWeight()}</div>
        </div>);
}
