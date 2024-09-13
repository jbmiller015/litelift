import {useEffect, useState} from "react";
import Exercise from "@/components/EditExercise";
import editExercise from "@/components/EditExercise";

export default function ExerciseList({exerciseData = []}) {
    const [exercises, setExercises] = useState(exerciseData);
    console.log("renderList")
    const showExercises = () => {
        return exercises.map((exercise) => <Exercise key={exercises.length + 1} weightsData={exercise}/>);
    }

    const addExercises = () => {
        setExercises([...exercises, <Exercise key={exercises.length + 1}/>]);
    }
    return (<>
        <div>{showExercises()}</div>
        <button onClick={() => addExercises()}>Add Exercise</button>
    </>);
}
