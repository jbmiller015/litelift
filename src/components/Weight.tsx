import Weight_Icon from "../assets/icon/weight_icon";
import Reps_icon from "../assets/icon/reps_icon";
import {StatusCode, WeightReps} from '@/context/ExerciseContext';

interface WeightRepsProps {
    weightReps: WeightReps;
    updateData: () => void;
    index: number;
}

export default function Weight({weightReps, updateData, index}: WeightRepsProps) {
    const {weight, reps, status} = weightReps;

    const setResult = () => {
        if (status as StatusCode === StatusCode.none) {
            updateData(StatusCode.complete, index);
        } else if (status as StatusCode === StatusCode.complete) {
            updateData(StatusCode.failed, index);
        } else if (status as StatusCode === StatusCode.failed) {
            updateData(StatusCode.none, index);
        }
    }

    const getBoxStyle = () => {
        switch (status) {
            case StatusCode.complete:
                return "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
            case StatusCode.failed:
                return "text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            case StatusCode.none:
                return ""
        }
    }

    return (<div
            className={`flex flex-col items-center justify-items-center rounded-lg p-2 m-2 outline outline-2 outline-offset-2 max-w-[10rem] min-w-[10rem] ${getBoxStyle()}`}
            onClick={() => setResult()}>
            <div className="relative w-full flex items-stretch self-center">
                <Weight_Icon/>
                <h3 className="text-3xl absolute left-1/2 font-bold place-self-center">{weight}</h3>
            </div>
            <div className={`border-2 w-full ${getBoxStyle()}`}/>
            <div className="relative w-full flex items-center space-x-2 self-center">
                <Reps_icon/>
                <h3 className="text-3xl font-bold absolute left-1/2 ml-[40px]">{reps}</h3>
            </div>
        </div>
    );
};
