import {useEffect, useState} from "react";
import Exercise from "@/components/Exercise";
import exercise from "@/components/Exercise";

export default function ExerciseList({exerciseData = []}) {
    const [exercises, setExercises] = useState(exerciseData);
    console.log("renderList")
    const showExercises = () => {
        return exercises
    }

    const addExercises = () => {
        setExercises([...exercises, <Exercise key={exercises.length + 1}/>]);
    }
    return (<>
        <div>{showExercises()}</div>
        <button onClick={() => addExercises()}>Add Exercise</button>
    </>);
}
