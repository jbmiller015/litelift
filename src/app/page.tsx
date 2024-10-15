import exampleData from "/Example_Data.json";
import Day from "@/components/Day";
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Home() {
    const cookieStore = cookies();
    cookieStore.getAll().forEach(el=>{console.log(el)})


    let exerciseData: any[] = exampleData;
    const showDays = () => {
        return exerciseData.map((day, i) => <Day exerciseData={day}/>)
    }
    if (!cookieStore.has('token')) {
        redirect('/welcome');
    }
    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">Lifts</h2>
        {showDays()}
    </div>);

}
