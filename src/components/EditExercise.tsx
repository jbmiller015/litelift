import EditWeight from '@/components/EditWeight'
import Weight from '@/components/Weight'
import {ObjectId} from "bson";
import Minus_Icon from "@/assets/icon/minus_icon";
import Plus_Icon from "@/assets/icon/plus_icon";

interface ExProps {
    weightsData: {
        _id: ObjectId,
        user_id: ObjectId,
        w_r: [[Object], [Object]],
        name: 'Squat'
    },
    editLift: any
}

export default function EditExercise({exerciseData = [], editLift}: ExProps) {

    console.log(exerciseData)
    const showWeight = () => {
        let result = exerciseData.w_r.map((wr, i) =>
            <EditWeight weight={wr.weight} reps={wr.reps} status={wr.status}/>
        )
        result.push(<div className="relative flex items-center max-w-[11rem] min-w-[10rem]">
            <div type="button" id="decrement-button" onClick={() => {
                //const newWeight = weight - 1;
                //setWeightData(newWeight);
            }}
                 className="btn m-2 w-100 border border-green-400 rounded-lg h-20 text-center text-green-400
                 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center h-24 w-[11rem]">
                <Plus_Icon/>
            </div>
        </div>)
        return result;
    }

    return (
        <div className="p-2 m-2 border border-gray-300 rounded">
            <h3 className="text-3xl font-bold dark:text-white pb-2">{exerciseData.exerciseName}</h3>
            <div className="flex flew-col flex-wrap gap-2 justify-center">{showWeight()}</div>
        </div>);
}
