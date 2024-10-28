import EditWeight from '@/components/EditWeight'
import Weight from '@/components/Weight'
import {ObjectId} from "bson";
import Minus_Icon from "@/assets/icon/minus_icon";
import Plus_Icon from "@/assets/icon/plus_icon";
import Cross_Icon from "@/assets/icon/cross_icon";
import {useState} from "react";

interface ExProps {
    weightsData: {
        exerciseId: ObjectId,
        w_r: [{ weight: number, reps: number, status: string }],
        exerciseName: string,
        weightRepId: ObjectId
    },
    editExerciseWR: any,
    deleteExerciseWR: any,
    deleteLift: any,
    addExerciseWR: any
    editExerciseName: any
}

export default function EditExercise({
                                         weightsData = {},
                                         editExerciseWR,
                                         deleteExerciseWR,
                                         deleteLift,
                                         addExerciseWR, editExerciseName
                                     }: ExProps) {
    const [updateData, setUpdateData] = useState<({
        weight: number,
        reps: number,
        status: string
    } | null)[]>(weightsData.w_r);

    const [inputVal, setInputVal] = useState<string>(weightsData.exerciseName);

    const showWeight = () => {
        let result = updateData.map((wr, i) => wr !== null ?
            <div key={`editWeight${i + weightsData.exerciseName}`}>
                <EditWeight index={i} weight={wr.weight} reps={wr.reps} editWR={(newVal, valueType) => {
                    editExerciseProp(i, newVal, valueType)
                }} deleteWR={() => {
                    deleteExerciseProp(i)
                }}/>
            </div> : null
        )
        result.push(<div key={`addWeightsReps${weightsData.exerciseName}`}
                         className="relative flex items-center max-w-[11rem] min-w-[10rem]">
            <div type="button" id="decrement-button" onClick={addExerciseProp}
                 className="btn m-2 w-100 border border-green-400 rounded-lg text-center text-green-400
                 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center h-20 w-[11rem]">
                <Plus_Icon/>
            </div>
        </div>)
        return result;
    }

    const addExerciseProp = () => {
        const newElement = {weight: 0, reps: 0, status: 'none'}
        setUpdateData((curr) => [...curr, newElement]);
        addExerciseWR(weightsData.exerciseId, newElement);
    }

    const editExerciseProp = (index, newVal, valueType) => {

        setUpdateData((curr) => {
            let editArray = curr;
            if (valueType === 'weight') {
                editArray[index].weight = newVal
                return editArray;
            } else {
                editArray[index].reps = newVal
                return editArray;
            }
        });
        editExerciseWR(weightsData.exerciseId, updateData);
    }

    const deleteExerciseProp = (index) => {
        console.log(index)
        setUpdateData((curr) => {
            let editArray = curr;
            editArray[index] = null;
            return editArray;
        });
        deleteExerciseWR(weightsData.exerciseId, index);
    }

    const editNameHandler = (e) => {
        setInputVal(e.target.value);
        editExerciseName(weightsData.exerciseId, e.target.value);
    }

    return (
        <div className="p-2 m-2 border border-gray-300 rounded">
            <div className="flex items-stretch w-100 justify-center mb-4">
                <div onClick={(e) => deleteLift(e)}
                     className="btn mv-2 absolute left-4 w-10 border border-red-400 rounded-lg text-center text-red-400 bg-transparent hover:bg-red-100 hover:text-red-900 dark:text-red-400 cursor-pointer flex flex-col items-center justify-center h-10">
                    <Cross_Icon/>
                </div>
                <input key={`EditTextLift${weightsData.exerciseId}`}
                       className="justify-self-center border rounded-lg text-center text-4xl font-bold dark:text-white pb-2 bg-transparent w-3/4 md:w-min"
                       placeholder={"Exercise Name"}
                       value={inputVal}
                       onChange={(e) => editNameHandler(e)}/>
            </div>
            <div className="flex flew-col flex-wrap gap-2 justify-center">{showWeight()}</div>
        </div>);
}
