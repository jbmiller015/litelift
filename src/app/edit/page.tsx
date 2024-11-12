'use client'
import EditDay from "@/components/EditDay";
import Plus_Icon from "@/assets/icon/plus_icon";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ObjectId} from "bson";

interface dayData {
    _id?: ObjectId | null,
    exerciseData: (ObjectId | null)[]
    name: string | null,
    user_id?: ObjectId | null
}

export default function EditHome() {
    const [exerciseData, setExerciseData] = useState<(dayData | null)[]>([]);
    const [deleteData, setDeleteData] = useState<ObjectId[]>([]);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const resource = pathname.slice('/edit/'.length)

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`http://localhost:3000/api/day/${resource}`, {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const showDays = () => {
        return exerciseData.map((day, i) => {
            if (day != null) {
                return <div key={`editDay${i}`}><EditDay exerciseData={day} editDay={editDay}
                                                         index={i} deleteDay={deleteDay}/>
                </div>
            }
        })
    }

    const editDay = (value: string, index: number) => {
        setExerciseData((ex) => {
            const newArray = [...ex];
            newArray[index] = {...newArray[index], name: value} as dayData;
            return newArray;
        })
    }
    const deleteDay = (index: number) => {

        if (exerciseData && exerciseData[index]?._id) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setDeleteData((data) => [...data, exerciseData[index]._id]);
        }
        setExerciseData((data) => {
            const newArray = [...data];
            newArray[index] = null;
            return newArray;
        })

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
    const submitHome = () => {
        async function submitData() {
            const requestData = exerciseData.filter(el => el !== null);
            const validCheck = requestData.some((el) => {
                return (!el.name || el.name === '')
            })
            if (validCheck) {
                setError({
                    status: 401,
                    statusText: 'Validation Error',
                    data: 'Please Give a Name to All New Lifts'
                });
                setLoading(false);
            } else {
                const res = await fetch(`http://localhost:3000/api/day/${resource}`, {
                    method: "PUT",
                    headers: {'Set-Cookie': document.cookie},
                    body: JSON.stringify({
                        edit_data: requestData,
                        delete_data: deleteData
                    })
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

    if (loading) return <p>Loading...</p>
    if (error) return <p>{`Loading... ${error}`}</p>
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
