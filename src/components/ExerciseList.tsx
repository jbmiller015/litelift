import Exercise from "@/components/Exercise";
import {useExerciseContext} from '@/context/ExerciseContext';

export default function EditExerciseList() {
    const {exerciseData,editExerciseProp,  saveOnExit} = useExerciseContext();

    return (<div>
        {exerciseData?.exerciseData.map((exercise, index) => (
            exercise ? (
                <div key={`editExercise${index}`}>
                    <Exercise exercise={exercise}/>
                </div>
            ) : null
        ))}
        <div onClick={() => saveOnExit()}
             className="btn m-2 mt-24 w-100 border-2 border-green-400 rounded-lg h-20 text-center text-green-800 dark:text-green-100 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
            <h2 className="text-3xl">Save & Exit</h2>
        </div>
    </div>);
}
