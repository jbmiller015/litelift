import exampleData from "/Example_Data.json";
import Day from "@/components/Day";

export default function Home() {

    let exerciseData: any[] = exampleData;
    const showDays = () => {
        return exerciseData.map((day, i) => <Day exerciseData={day}/>)
    }
    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">Lifts</h2>
        {showDays()}
    </div>);

}
