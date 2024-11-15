import ExerciseView from "@/components/ExerciseView";
import {useExerciseContext} from '@/context/ExerciseContext';

export default function EditExerciseList() {
    const {exerciseData} = useExerciseContext();

    return (<div>
        {exerciseData?.exerciseData.map((exercise, index) => (
            exercise ? (
                <div key={`editExercise${index}`}>
                    <ExerciseView exercise={exercise} index={index}/>
                </div>
            ) : null
        ))}

    </div>);
}
