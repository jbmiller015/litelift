'use client'
import exampleData from "/Example_Data.json";
import EditWeight from "@/components/EditWeight";
import Plus_Icon from "@/assets/icon/plus_icon";
import {useEffect, useState} from "react";
import {ObjectId} from "bson";
import EditExerciseList from "@/components/EditExerciseList";
import {usePathname, useRouter} from "next/navigation";

interface ExData {
    exerciseData: [{
        exerciseId: ObjectId | string,
        w_r: [{ weight: number, reps: number, status: string }],
        exerciseName: string,
        weightRepId: ObjectId | string
    } | null],
    name: string,
    user_id: ObjectId,
    _id: ObjectId
}

export default function EditDay() {
    const pathname = usePathname();
    const router = useRouter();
    let resource = pathname.slice('/edit/'.length)
    const [exerciseData, setExerciseData] = useState<ExData>(null);
    const [initExerciseData, setInitExerciseData] = useState<[ExData.exerciseData]>(null);
    const [deleteData, setDeleteData] = useState({
        lifts: [],
        w_rs: []
    });
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
            let res = await fetch(`http://localhost:3000/api/day/${resource}`, {
                method: "GET",
                headers: {'Set-Cookie': document.cookie}
            })
            if (res.ok) {
                const data = await res.json();
                setExerciseData(data);
                setInitExerciseData(data?.exerciseData);
                setLoading(false);
            } else {
                const errorBody = await res.json();
                setError({status: res.status, statusText: res.statusText, data: errorBody});
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <p>Loading...</p>
    if (!error) return <p>No profile data</p>


    const editLift = (id, value, delData) => {
        if (value === null || typeof value === "object") {
            setExerciseData((curr) => {
                curr.exerciseData.find((el) => el && el.exerciseId == id).w_r = value;
                return curr;
            })
        } else if (typeof value === "string") {
            setExerciseData((curr) => {
                curr.exerciseData.find((el) => el && el.exerciseId == id).exerciseName = value;
                return curr;
            })
        }
        if (delData) {
            setDeleteData((curr) => {
                const newArray = curr.w_rs;
                newArray.push(delData)
                return {...curr, w_rs: newArray}
            })
        }

    }
    const deleteLift = (id) => {
        const deleteId = initExerciseData.find((el) => el.exerciseId.toString() === id.toString())
        if (deleteId) {
            setDeleteData((curr) => {
                const newArray = curr.lifts;
                newArray.push(deleteId)
                return {...curr, lifts: newArray}
            })
        }

        setExerciseData((curr) => {
            const newArray = curr.exerciseData.map((el) => {
                if (el && el.exerciseId.toString() === id.toString()) {
                    return null;
                } else return el
            })
            console.log(newArray)
            return {...curr, exerciseData: newArray} as ExData;
        })

    }

    const addLift = (val) => {
        setExerciseData((curr) => {
            return {...curr, exerciseData: [...curr.exerciseData, val]} as ExData;
        })
    }
    const submitEdit = () => {
        async function submitData() {
            const requestData = exerciseData.exerciseData.filter((el) => el !== null)
            console.log(requestData)
            const validCheck = requestData.some((el) => {
                return (!el || (!el.exerciseName || el.exerciseName === ''))
            })
            if (validCheck) {
                setError({
                    status: 401,
                    statusText: 'Validation Error',
                    data: 'Please Give a Name to All New Lifts'
                });
                setLoading(false);
            } else {
                let res = await fetch(`http://localhost:3000/api/day/${resource}/exercise`, {
                    method: "PUT",
                    headers: {'Set-Cookie': document.cookie},
                    body: JSON.stringify({
                        edit_data: requestData,
                        delete_data: deleteData
                    })
                })
                if (res.ok) {
                    router.push(`/day/${resource}`);
                } else {
                    const errorBody = await res.json();
                    setError({status: res.status, statusText: res.statusText, data: errorBody});
                    setLoading(false)
                }
            }
        }

        submitData()
    }
    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">{exerciseData.name}</h2>
        <EditExerciseList exerciseData={exerciseData.exerciseData} editLift={editLift}
                          addLift={addLift} deleteLift={deleteLift}/>
        <div onClick={submitEdit}
             className="btn m-2 w-100 border border-gray-400 rounded-lg h-20 text-center text-gray-900 bg-green-400 hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
            <h2 className="text-3xl">Done</h2>
        </div>
    </div>);

}
