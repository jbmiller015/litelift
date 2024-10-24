import EditWeight from '@/components/EditWeight'
import Weight from '@/components/Weight'
import {ObjectId} from "bson";
import {String} from "postcss-selector-parser";

interface ExProps {
    weightsData: {
        _id: ObjectId,
        user_id: ObjectId,
        w_r: [[Object], [Object]],
        exerciseName: String
    },
    key: String,
    editUpdateData?: (value, index) => void,
    index?: number
}

export default function exercise({weightsData = [], editUpdateData, index}: ExProps) {

    const showWeight = () => {

        return weightsData.w_r.map((wr, i) =>
            <div key={`weight${i}`}><Weight weight={wr.weight} reps={wr.reps} status={wr.status}
                                            updateData={(val) => updateData(val, i)}
                                            index={i}/>
            </div>
        )
    }
    const updateData = (statusCode, ind) => {
        if (editUpdateData) {
            editUpdateData(statusCode, [ind, index])
        }
    }

    return (
        <div className="p-2 m-2 border border-gray-300 rounded">
            <h3 className="text-3xl font-bold dark:text-white pb-2">{weightsData.exerciseName}</h3>
            <div className="flex flew-col flex-wrap gap-2 justify-center">{showWeight()}</div>
        </div>);
}
