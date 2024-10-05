import Edit_Icon from "@/assets/icon/reps_icon";
import Minus_Icon from "../assets/icon/minus_icon";
import Plus_Icon from "../assets/icon/plus_icon";
import Reps_icon from "../assets/icon/reps_icon";
import Weight_Icon from "../assets/icon/weight_icon";

export default function editWeight({weightData = 0, repsData = 1, increment = 10, edit}: {}) {
    console.log("renderWeight")

    function deleteWeights(e: React.MouseEvent<HTMLDivElement>) {

    }

    return (<div className="flex flex-col p-2">
            {edit ? <div onClick={(e) => deleteWeights(e)}
                         className="text-gray-700 border border-gray-700 font-medium rounded-lg text-lg p-2 text-center inline-flex items-center me-2 dark:border-gray-500 dark:text-gray-500 dark:">
                <Edit_Icon/>
                Edit Set
            </div> : null}
            <div className="relative flex items-center max-w-[11rem] min-w-[10rem]">
                <button type="button" id="decrement-button" onClick={() => {
                    const newWeight = weightData - 1;
                    //setWeightData(newWeight);
                }}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <Minus_Icon/>
                </button>
                <input type="text" id="weight-input" data-input-counter data-input-counter-min="1"
                       data-input-counter-max="5" aria-describedby="helper-text-explanation"
                       className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="" value={weightData} required/>
                <div
                    className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                    <Weight_Icon/>
                    <span>Weight</span>
                </div>
                <button type="button" id="increment-button" onClick={() => {
                    const newWeight = weightData + increment;
                    //setWeightData(newWeight);
                }}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <Plus_Icon/>
                </button>
            </div>
            <div className="relative flex items-center max-w-[11rem]">
                <button type="button" id="decrement-button" onClick={() => {
                    const newReps = repsData - 1;
                    //setRepsData(newReps);
                }}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <Minus_Icon/>
                </button>
                <input type="text" id="reps-input" data-input-counter min="1"
                       aria-describedby="helper-text-explanation"
                       className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="" value={repsData} required/>
                <div
                    className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                    <Reps_icon/>
                    <span>Reps</span>
                </div>
                <button type="button" id="increment-button" onClick={() => {
                    const newReps = repsData + 1;
                    //setRepsData(newReps);
                }}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <Plus_Icon/>
                </button>
            </div>
        </div>
    );
};
