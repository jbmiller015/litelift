'use client'
import exampleData from "/Example_Data.json";
import EditWeight from "@/components/EditWeight";
import Plus_Icon from "@/assets/icon/plus_icon";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

export default function EditDay() {
    const pathname = usePathname();
    let resource = pathname.slice('/edit/'.length)
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/day/${resource}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>

    let exerciseData: any[] = exampleData;
    const showDays = () => {
        return exerciseData.map((day, i) => <EditWeight exerciseData={day} editDay={editDay}/>)
    }
    const editDay = () => {

    }
    const submitHome = () => {
        //
    }
    const addDay = () => {

    }
    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">{data}</h2>
        {showDays()}
        <div onClick={() => addDay()}
             className="btn m-2 w-100 border border-green-400 rounded-lg h-20 text-center text-green-400 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
            <Plus_Icon/>
        </div>
        <div onClick={() => submitHome()}
             className="btn m-2 w-100 border border-gray-400 rounded-lg h-20 text-center text-gray-900 bg-green-400 hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
            <h2 className="text-3xl">Done</h2>
        </div>
    </div>);

}
