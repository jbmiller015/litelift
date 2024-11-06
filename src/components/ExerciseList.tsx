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

    </div>);
}
