import Exercise from "@/components/Exercise";
import editExercise from "@/components/EditExercise";

export default function ExerciseList({exerciseData = []}) {
    console.log("renderList")
    const showExercises = () => {
        return exerciseData.map((exercise) => <Exercise key={`${exerciseData.length + 1}`} weightsData={exercise}/>);
    }

    const addExercises = () => {
        //setExercises([...exercises, <Exercise key={exercises.length + 1}/>]);
    }
    return (<>
        <div>{showExercises()}</div>
        <button onClick={() => addExercises()}>Add Exercise</button>
    </>);
}
