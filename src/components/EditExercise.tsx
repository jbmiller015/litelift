import EditWeight from '@/components/EditWeight'
import Weight from '@/components/Weight'
import {ObjectId} from "bson";
import Minus_Icon from "@/assets/icon/minus_icon";
import Plus_Icon from "@/assets/icon/plus_icon";
import Cross_Icon from "@/assets/icon/cross_icon";
import {useState} from "react";

interface ExProps {
    weightsData: {
        _id: ObjectId,
        user_id: ObjectId,
        w_r: [[Object], [Object]],
        name: 'Squat'
    },
    editLift: any
}

export default function EditExercise({weightsData = {}, editLift, deleteLift, addLift}: ExProps) {
    const [updateData, setUpdateData] = useState<{}>(weightsData);

    console.log(exerciseData)
    const showWeight = () => {
        let result = updateData.w_r.map((wr, i) =>
            <div key={`editWeight${i}`}>
                <EditWeight weight={wr.weight} reps={wr.reps} editWR={(newVal, valueType) => {
                    editExerciseWR(i, newVal, valueType)
                }} deleteWR={}/>
            </div>
        )
        result.push(<div className="relative flex items-center max-w-[11rem] min-w-[10rem]">
            <div type="button" id="decrement-button" onClick={() => {
                //const newWeight = weight - 1;
                //setWeightData(newWeight);
            }}
                 className="btn m-2 w-100 border border-green-400 rounded-lg text-center text-green-400
                 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center h-20 w-[11rem]">
                <Plus_Icon/>
            </div>
        </div>)
        return result;
    }

    const editExerciseWR = (index, newVal, valueType) => {
        exerciseData.w_r[index] = newVal;
    }

    return (
        <div className="p-2 m-2 border border-gray-300 rounded">
            <div className="flex items-stretch w-100 justify-center mb-4">
                <div onClick={(e) => deleteLift(e)}
                     className="btn mv-2 absolute left-4 w-10 border border-red-400 rounded-lg text-center text-red-400 bg-transparent hover:bg-red-100 hover:text-red-900 dark:text-red-400 cursor-pointer flex flex-col items-center justify-center h-10">
                    <Cross_Icon/>
                </div>
                <div
                    className="justify-self-center text-4xl font-bold dark:text-white pb-2">{exerciseData.exerciseName}</div>
            </div>
            <div className="flex flew-col flex-wrap gap-2 justify-center">{showWeight()}</div>
        </div>);
}
