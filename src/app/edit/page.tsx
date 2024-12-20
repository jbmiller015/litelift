'use client'
import EditDay from "@/components/EditDay";
import Plus_Icon from "@/assets/icon/plus_icon";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ObjectId} from "bson";
import emptyCacheAtTarget from "@/lib/cacheHandler";

interface dayData {
    _id?: ObjectId | null,
    exerciseData: (ObjectId | null)[]
    name: string | null,
    user_id?: ObjectId | null
}

export default function EditHome() {
    const [exerciseData, setExerciseData] = useState<(dayData | null)[]>([]);
    const [deleteData, setDeleteData] = useState<ObjectId[]>([]);
    const [error, setError] = useState<object | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {

        const base = process.env.NEXT_PUBLIC_BASE_URL;
        if (!base) {
            throw new Error("Base URL not set in environment variables");
        }
        fetch(`${base}/api/day/`, {
            method: "GET",
            headers: {'cookie': document.cookie}
        }).then(async (res) => {
            const data = await res.json();
            console.log(data)
            setExerciseData(data as unknown as (dayData | null)[]);
            setLoading(false);
        }).catch((err) => {
            const errorBody = err.json();
            setError({status: err.status, statusText: err.statusText, data: errorBody});
            setLoading(false)
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const showDays = () => {
        return exerciseData.map((day: dayData | null, i: number) => {
            if (day != null) {
                return (<div key={`editDay${i}`}>
                    <EditDay exerciseData={day} editDay={editDay}
                             index={i} deleteDay={deleteDay}/>
                </div>);
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
            } else {
                const base = process.env.NEXT_PUBLIC_BASE_URL;
                if (!base) {
                    throw new Error("Base URL not set in environment variables");
                }
                setLoading(true);
                const res = await fetch(`${base}/api/day/`, {
                    method: "PUT",
                    headers: {'Set-Cookie': document.cookie},
                    body: JSON.stringify({
                        edit_data: requestData,
                        delete_data: deleteData
                    })
                })
                if (res.ok) {
                    await emptyCacheAtTarget(`${base}/exercises`);
                    router.push(`${base}/exercises`);
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
    if (error) return <p>{`Error: ${error}`}</p>

    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">Edit Workouts</h2>
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
