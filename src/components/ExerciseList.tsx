import Exercise from "@/components/Exercise";
import editExercise from "@/components/EditExercise";
//import exerciseData from "/Example_Data.json";

export default function ExerciseList({exerciseData = []}) {
    const showExercises = () => {
        return exerciseData.map((exercise) => <Exercise weightsData={exercise}/>);
    }

    const addExercises = () => {
        //setExercises([...exercises, <Exercise key={exercises.length + 1}/>]);
    }
    return (<>
        <div>{showExercises()}</div>
        <button onClick={() => addExercises()}>Add Exercise</button>
    </>);
}
