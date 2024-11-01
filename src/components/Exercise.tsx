import EditWeight from '@/components/EditWeight'
import Weight from '@/components/Weight'
import {ObjectId} from "bson";
import {useExerciseContext} from '@/context/ExerciseContext';
import {Exercise} from '@/context/ExerciseContext';

interface ExerciseProps {
    exercise: Exercise;
    key: String,
    index: number
}

export default function Exercise({exercise, index}: ExerciseProps) {
    const {updateWeightReps} = useExerciseContext();
    const showWeight = () => {

        return exercise.w_r.map((wr, i) =>
            <div key={`weight${i}`}><Weight weightReps={wr}
                                            updateData={(val, i) => updateData(val, i)}
                                            index={i}/>
            </div>
        )
    }
    const updateData = (statusCode, ind) => {
        updateWeightReps(exercise._id, ind, statusCode, statusCode);
    }

    return (
        <div className="p-2 m-2 border border-gray-300 rounded">
            <h3 className="text-3xl font-bold dark:text-white pb-2">{exercise.name}</h3>
            <div className="flex flew-col flex-wrap gap-2 justify-center">{showWeight()}</div>
        </div>);
}
