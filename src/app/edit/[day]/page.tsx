'use client'
import exampleData from "/Example_Data.json";
import EditWeight from "@/components/EditWeight";
import Plus_Icon from "@/assets/icon/plus_icon";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {ObjectId} from "bson";
import EditExerciseList from "@/components/EditExerciseList";

export default function EditDay() {
    const pathname = usePathname();
    let resource = pathname.slice('/edit/'.length)
    const [exerciseData, setExerciseData] = useState([]);
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
                console.log(data)
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


    const editLift = (value, index) => {
        setExerciseData((ex) => {
            const newArray = [...ex];
            newArray[index] = {...newArray[index], name: value} as dayData;
            return newArray;
        })
    }
    const deleteLift = (index) => {
        if (exerciseData[index]._id) {
            setDeleteData((data) => [...data, exerciseData[index]._id]);
        }
        setExerciseData((data) => {
            const newArray = [...data];
            newArray[index] = null;
            return newArray;
        })

    }

    const addLift = (val) => {
        //
    }
    const submitDay = () => {
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
                let res = await fetch(`http://localhost:3000/api/day/${resource}`, {
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
    return (<div className="text-center">
        <h2 className="text-5xl border-b-2 my-4">{exerciseData.name}</h2>
        <EditExerciseList exerciseData={exerciseData.exerciseData} exerciseId={exerciseData.id} editLift={editLift}
                          addLift={addLift} deleteLift={deleteLift}/>
        <div onClick={() => submitDay()}
             className="btn m-2 w-100 border border-gray-400 rounded-lg h-20 text-center text-gray-900 bg-green-400 hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
            <h2 className="text-3xl">Done</h2>
        </div>
    </div>);

}
