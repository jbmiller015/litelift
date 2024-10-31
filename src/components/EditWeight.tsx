import Edit_Icon from "@/assets/icon/reps_icon";
import Minus_Icon from "../assets/icon/minus_icon";
import Plus_Icon from "../assets/icon/plus_icon";
import Reps_Icon from "../assets/icon/reps_icon";
import Weight_Icon from "../assets/icon/weight_icon";
import Cross_Icon from "@/assets/icon/cross_icon";
import {useEffect, useState} from "react";

function EditWR({value, editWR, increment, valueType, index}) {
    useEffect(() => {
        setInputValue(value)
    }, [value]);
    const [inputValue, setInputValue] = useState<number>(value);
    const [showField, setShowField] = useState<boolean>(false);
    return <div className="relative flex items-center max-w-[11rem]" key={`editWr${valueType + index}`}>
        <div key={`editWrMinus${valueType + index}`}
             className="btn mv-2 px-2 border border-gray-400 rounded-lg text-center text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex flex-col items-center justify-center h-12 w-10"
             id="decrement-button" onClick={() => {
            setShowField(true)
            const newVal = inputValue - (valueType === 'weight' ? increment : 1);
            setInputValue(newVal)
            editWR(newVal, valueType, index);
        }}>
            <Minus_Icon/>
        </div>
        {(value && inputValue) === 0 && !showField ? (valueType === 'weight' ? <div onClick={() => setShowField(true)}
                                                                                    className="btn text-xl font-bold mv-2 border border-gray-400 rounded-lg text-center text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex flex-col items-center justify-center h-12 w-20">
                    <Weight_Icon/>
                </div> :
                <div onClick={() => setShowField(true)}
                     className="btn text-xl font-bold mv-2 border border-gray-400 rounded-lg text-center text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex flex-col items-center justify-center h-12 w-20">
                    <Reps_Icon/>
                </div>) :
            <input type="text" id="reps-input" data-input-counter min="1" key={`editWrManual${valueType + index}`}
                   aria-describedby="helper-text-explanation"
                   className="btn text-xl font-bold mv-2 border border-gray-400 rounded-lg text-center text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex flex-col items-center justify-center h-12 w-20"
                   placeholder={value} value={inputValue} required onChange={(e) => {
                setInputValue(e.target.value as number)
                editWR(e.target.value, valueType);
            }}/>}
        <div key={`editWrPlus${valueType + index}`}
             className="btn mv-2 border border-gray-400 rounded-lg text-center text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex flex-col items-center justify-center h-12 w-10"
             id="increment-button" onClick={() => {
            setShowField(true)
            const newVal = inputValue + (valueType === 'weight' ? increment : 1);
            setInputValue(newVal)
            editWR(newVal, valueType);
        }}>
            <Plus_Icon/>
        </div>
    </div>;
}

interface EditWeightProps {
    weight?: number,
    reps?: number,
    increment?: number,
    editWR?: any,
    deleteWR?: any,
    index?: number
}

export default function EditWeight({weight = 0, reps = 1, increment = 5, editWR, deleteWR, index}: EditWeightProps) {


    return (<div className="flex flex-col items-center p-2">
            <EditWR value={weight} editWR={editWR} increment={increment} valueType={'weight'} index={index}/>
            <EditWR value={reps} editWR={editWR} increment={increment} valueType={'reps'} index={index}/>
            <div onClick={deleteWR}
                 className="btn mv-2 w-20 border border-red-400 rounded-lg text-center text-red-400 bg-transparent hover:bg-red-100 hover:text-red-900 dark:text-red-400 cursor-pointer flex flex-col items-center justify-center h-8">
                <Cross_Icon/>
            </div>
        </div>
    );
};
