'use client'
import exampleData from "/Example_Data.json";
import EditDay from "@/components/EditDay";
import Plus_Icon from "@/assets/icon/plus_icon";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ObjectId} from "bson";

interface dayData {
    _id?: ObjectId,
    exerciseData: ObjectId[]
    name: string,
    user_id?: ObjectId
}

export default function EditHome() {
    const [exerciseData, setExerciseData] = useState<dayData[]>(exampleData);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    let resource = pathname.slice('/edit/'.length)

    useEffect(() => {
        async function fetchData() {
            let res = await fetch(`http://localhost:3000/api/day/${resource}`, {
                method: "GET",
                headers: {'Set-Cookie': document.cookie}
            })
            if (res.ok) {
                const data = await res.json();
                console.log(data)
                setExerciseData(data);
                setLoading(false);
            } else {
                const errorBody = await res.json();
                setError({status: res.status, statusText: res.statusText, data: errorBody});
                setLoading(false)
            }
        }

        fetchData()
    }, [])
    const showDays = () => {
        return exerciseData.map((day, i) => <div key={`editDay${i}`}><EditDay exerciseData={day} editDay={editDay}
                                                                              index={i}/>
        </div>)
    }
    const editDay = (value, index) => {
        setExerciseData((ex) => {
            const newArray = [...ex];
            newArray[index] = {...newArray[index], name: value}
            return newArray;
        })
        console.log(exerciseData)
    }
    const submitHome = () => {
        async function submitData() {
            const validCheck = exerciseData.some((el) => {
                return (el.name === '')
            })
            if (validCheck) {
                setError({status: 401, statusText: 'Validation Error', data: 'Please Give a Name to All New Lifts'});
                setLoading(false);
            } else {
                let res = await fetch(`http://localhost:3000/api/day/${resource}`, {
                    method: "PUT",
                    headers: {'Set-Cookie': document.cookie},
                    body: JSON.stringify(exerciseData)
                })
                if (res.ok) {
                    router.push('/');
                } else {
                    const errorBody = await res.json();
                    setError({status: res.status, statusText: res.statusText, data: errorBody});
                    setLoading(false)
                }
            }
        }
        submitData()
    }
    const addDay = () => {
        setExerciseData((data) => {
            const newExercise: dayData = {
                name: '',
                exerciseData: [] as ObjectId[]
            }
            return [...data, newExercise];
        })
    }
    if (loading) return <p>Loading...</p>
    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">Lifts</h2>
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
