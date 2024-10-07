import Link from "next/link";
import Cross_Icon from "@/assets/icon/cross_icon";

export default function EditDay({exerciseData, editDay, deleteDay}) {
    const editDayHandler = (e) => {
        editDay(exerciseData.name,e.target.value)
    }
    const deleteDayHandler = (e) => {
      deleteDay
    }
    return (
        <div key={exerciseData.name}
            className="m-2 w-100 p-5 border rounded-lg h-20 text-center bg-clear flex flex-row justify-between items-center">
            <input className="text-3xl bg-transparent w-3/4 md:w-min" placeholder={exerciseData.name} onChange={(e)=>editDayHandler(e)}/>
            <div onClick={(e)=>deleteDayHandler(e)}
                className="btn w-14 h-14 h-full rounded-lg h-20 text-center bg-red-400 bg-transparent hover:bg-red-100 hover:text-red-900 bg-clip-text">
                <Cross_Icon/>
            </div>
        </div>
    );
}
