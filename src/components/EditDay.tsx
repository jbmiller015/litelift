import Cross_Icon from "@/assets/icon/cross_icon";
import React, {useState} from "react";
import {ObjectId} from "bson";

interface dayData {
    _id?: ObjectId | null,
    exerciseData: (ObjectId | null)[]
    name: string | null,
    user_id?: ObjectId | null
}

interface EditDayProps {
    exerciseData: dayData,
    editDay: (val: string, index: number) => void,
    deleteDay: (index: number) => void,
    index: number
}


export default function EditDay({exerciseData, editDay, deleteDay, index}: EditDayProps) {
    const [inputVal, setInputVal] = useState<string>(exerciseData.name ? exerciseData.name : '')

    const editDayHandler = (e: string) => {
        setInputVal(e)
        editDay(e, index);
    }
    const deleteDayHandler = () => {
        setInputVal('');
        deleteDay(index);
    }
    return (
        <div
            className="m-2 w-100 p-5 border rounded-lg h-20 text-center bg-clear flex flex-row justify-between items-center">
            <input key={`EditTextDay${index}`} className="text-3xl bg-transparent w-3/4 md:w-min"
                   placeholder={inputVal}
                   value={inputVal} onChange={(e) => editDayHandler(e.target.value)}
            />
            <div onClick={() => deleteDayHandler()}
                 className="btn w-14 h-14 h-full rounded-lg h-20 text-center bg-red-400 bg-transparent hover:bg-red-100 hover:text-red-900 bg-clip-text">
                <Cross_Icon/>
            </div>
        </div>
    );
}
