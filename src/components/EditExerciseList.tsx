// components/EditExerciseList.tsx

import Plus_Icon from '@/assets/icon/plus_icon';
import EditExercise from '@/components/EditExercise';
import {useExerciseContext} from '@/context/ExerciseContext';

export default function EditExerciseList() {
    const {exerciseData, addExercise, deleteExercise} = useExerciseContext();
    console.log(exerciseData)

    return (
        <div>
            {exerciseData?.exerciseData.map((exercise, index) => (
                exercise ? (
                    <div key={`editExercise${index}`}>
                        <EditExercise exercise={exercise} deleteExercise={() => deleteExercise(exercise._id)}/>
                    </div>
                ) : null
            ))}
            <div onClick={addExercise}
                 className="btn m-2 w-100 border border-green-400 rounded-lg h-20 text-center text-green-400 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
                <Plus_Icon/>
            </div>
        </div>
    );
}
