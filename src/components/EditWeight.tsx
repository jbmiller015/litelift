import Edit_Icon from "@/assets/icon/reps_icon";
import Minus_Icon from "../assets/icon/minus_icon";
import Plus_Icon from "../assets/icon/plus_icon";
import Reps_icon from "../assets/icon/reps_icon";
import Weight_Icon from "../assets/icon/weight_icon";

function EditWR(props: { value: any }) {
    return <div className="relative flex items-center max-w-[11rem]">
        <div type="button" id="decrement-button" onClick={() => {
            const newReps = props.value - 1;
            //setRepsData(newReps);
        }}
             className="bg-transparent dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-12 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
            <Minus_Icon/>
        </div>
        <input type="text" id="reps-input" data-input-counter min="1"
               aria-describedby="helper-text-explanation"
               className="bg-gray-50 border-x-0 border-gray-300 h-12 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="" value={props.value} required/>

        <div type="button" id="increment-button" onClick={() => {
            const newReps = props.value + 1;
            //setRepsData(newReps);
        }}
             className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-12 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
            <Plus_Icon/>
        </div>
    </div>;
}

export default function EditWeight({weight = 0, reps = 1, status = "none", increment = 10, edit}: {}) {
    console.log("renderWeight")

    function deleteWeights(e: React.MouseEvent<HTMLDivElement>) {

    }

    return (<div className="flex flex-col p-2">
            <div onClick={(e) => deleteWeights(e)}
                 className="text-gray-700 border border-gray-700 font-medium rounded-lg text-lg p-2 text-center inline-flex items-center me-2 dark:border-gray-500 dark:text-gray-500 dark:">
                <Edit_Icon/>
                Edit Set
            </div>

            <EditWR value={weight}/>
            <EditWR value={reps}/>
        </div>
    );
};
