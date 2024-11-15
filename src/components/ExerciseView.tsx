import Weight from '@/components/Weight'
import {Exercise, StatusCode, useExerciseContext} from '@/context/ExerciseContext';

interface ExerciseProps {
    exercise: Exercise;
    index: number
}

export default function ExerciseView({exercise}: ExerciseProps) {
    const {updateWeightReps} = useExerciseContext();
    const showWeight = () => {

        return exercise.w_r.map((wr, i) =>
            <div key={`weight${i}`}><Weight weightReps={wr}
                                            updateData={(val, i) => updateData(val, i)}
                                            index={i}/>
            </div>
        )
    }
    const updateData = (statusCode: StatusCode, ind: number) => {
        updateWeightReps(exercise._id, ind, statusCode, 'status');
    }

    return (
        <div className="p-2 m-2 border border-gray-300 rounded">
            <h3 className="text-3xl font-bold dark:text-white pb-2">{exercise.name}</h3>
            <div className="flex flew-col flex-wrap gap-2 justify-center">{showWeight()}</div>
        </div>);
}
