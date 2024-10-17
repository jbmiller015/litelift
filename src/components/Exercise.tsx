import EditWeight from '@/components/EditWeight'
import Weight from '@/components/Weight'
import {ObjectId} from "bson";

interface ExProps {
    weightsData: {
        _id: ObjectId,
        user_id: ObjectId,
        w_r: [[Object], [Object]],
        name: 'Squat'
    },
    key: String
}

export default function exercise({weightsData = [], key}: ExProps) {

    const showWeight = () => {
        return weightsData.w_r.map((wr, i) =>
            <div key={`weight${i}`}><Weight weight={wr.weight} reps={wr.reps} complete={wr.complete} fail={wr.fail}/>
            </div>
        )
    }

    return (
        <div className="p-2 m-2 border border-gray-300 rounded" key={key}>
            <h3 className="text-3xl font-bold dark:text-white pb-2">{weightsData.name}</h3>
            <div className="flex flew-col flex-wrap gap-2 justify-center">{showWeight()}</div>
        </div>);
}
