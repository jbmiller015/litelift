import exampleData from "/Example_Data.json";
import EditDay from "@/components/EditDay";
import Plus_Icon from "@/assets/icon/plus_icon";

export default function EditHome() {

    let exerciseData: any[] = exampleData;
    const showDays = () => {
        return exerciseData.map((day, i) => <EditDay exerciseData={day}/>)
    }
    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">Lifts</h2>
        {showDays()}
        <div
            className="btn m-2 w-100 border border-green-400 rounded-lg h-20 text-center text-green-400 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
            <Plus_Icon/>
        </div>
    </div>);

}
