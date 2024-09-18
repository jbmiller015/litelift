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
            <Weight />
        )
    }

    const addWeight = () => {
        //setWeightsData([...weightsData, ]);
    }

    const editWeights = () => {
        //setEditExercise(true);
    }

    const submitWeights = () => {
        //setEditExercise(false);
        //Post to store
    }
    return (
        <div className="" key={key}>
            <h2>{weightsData.name}</h2>
            <form className="flex flew-row flex-wrap max-w-sm mx-auto">
                <div>
                    <input type="text" id="exercise" aria-describedby="editExercise-name" placeholder="Exercise"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block min-w-[10rem] w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                    />
                </div>
                <div>
                    <div className="flex flew-col flex-wrap max-w-sm mx-auto">{showWeight()}</div>
                </div>
                <div onClick={() => addWeight()}
                     className="text-gray-700 border border-gray-700   font-medium rounded-lg text-sm p-2 text-center inline-flex items-center me-2 dark:border-gray-500 dark:text-gray-500 dark:">
                    <svg className="w-10 h-6 text-gray-900 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 1v16M1 9h16"/>
                    </svg>
                    Add to Set
                </div>
            </form>

        </div>)
        ;
}
