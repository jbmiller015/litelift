import Exercise from "@/components/Exercise";
import editExercise_old from "@/components/EditExercise_old";
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ObjectId} from "bson";

//import exerciseData from "/Example_Data.json";

interface dayData {
    _id?: ObjectId | null,
    exerciseData: (ObjectId | null)[]
    name: string | null,
    user_id?: ObjectId | null
}

export default function ExerciseList({exerciseData = []}) {
    const [updateData, setUpdateData] = useState<any[]>([]);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    let resource = pathname.slice('/day/'.length)

    const showExercises = () => {
        return exerciseData.map((exercise, i) => <div key={`exercise${i}`}><Exercise weightsData={exercise}/></div>);
    }

    const addExercises = () => {
        //setExercises([...exercises, <Exercise key={exercises.length + 1}/>]);
    }

    const editUpdateData = (value, index) => {
        setUpdateData((ex) => {
            const newArray = [...ex];
            newArray[index] = {...newArray[index], name: value};
            return newArray;
        })
    }

    const saveOnExit = () => {
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
    return (<>
        <div>{showExercises()}</div>
        <div onClick={() => saveOnExit()}
             className="btn m-2 mt-24 w-100 border-2 border-green-400 rounded-lg h-20 text-center text-green-800 dark:text-green-100 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
            <h2 className="text-3xl">Save & Exit</h2>
        </div>
    </>);
}
