import {useEffect, useState} from "react";
import Weight from "./Weight";

export default function exercise({weightsData = []}) {

    const [weights, setWeights] = useState(weightsData);
    useEffect(() => {
        if (weights.length < 1) {
            addWeight();
        }
    }, []);
    console.log("renderexercise")

    const showWeight = () => {
        return weights
    }

    const addWeight = () => {
        setWeights([...weights, <Weight/>]);
    }
    return (
        <div className="">
            <form className="flex flew-row max-w-sm mx-auto">
                <div>
                    <input type="text" id="exercise" aria-describedby="exercise-name" placeholder="Exercise"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                <div>
                    <div className="flex flew-col max-w-sm mx-auto">{showWeight()}</div>
                </div>
                <div className="btn" onClick={() => addWeight()}>Add Weight</div>
            </form>

        </div>);
}
