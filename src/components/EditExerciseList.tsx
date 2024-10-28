import Exercise from "@/components/Exercise";
import editExercise_old from "@/components/EditExercise_old";
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ObjectId} from "bson";
import Plus_Icon from "@/assets/icon/plus_icon";
import EditWeight from "@/components/EditWeight";
import EditExercise from "@/components/EditExercise";

//import exerciseData from "/Example_Data.json";

interface dayData {
    _id?: ObjectId | null,
    exerciseData: (ObjectId | null)[]
    name: string | null,
    user_id?: ObjectId | null
}

interface weightsData {
    exerciseId: ObjectId,
    w_r: [{ weight: number, reps: number, status: string }] | [],
    exerciseName: string | '',
    weightRepId: ObjectId
}


export default function EditExerciseList({exerciseData = [], exerciseId, editLift, addLift, deleteLift}) {
    const [updateData, setUpdateData] = useState<weightsData[]>(exerciseData);
    const [deleteData, setDeleteData] = useState<[{ exerciseId: ObjectId, data: string[] }]>([]);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    let resource = pathname.slice('/day/'.length);

    const showExercises = () => {
        return updateData.map((exercise, i) => <div key={`editExercise${i}`}>
            <EditExercise weightsData={exercise} editExerciseWR={editExerciseWR} deleteExerciseWR={deleteExerciseWR}
                          deleteLift={() => {
                              deleteLift(i);
                          }} addExerciseWR={addExerciseWR} editExerciseName={editExerciseName}/></div>)
    }


    const addExerciseWR = (id, value) => {
        setUpdateData((curr) => {
            curr.find(el => el.exerciseId === id)?.w_r.push(value);
            return curr;
        });
    }
    const deleteExerciseWR = (id, index) => {
        setUpdateData((curr) => {
            curr.find(el => el.exerciseId === id).w_r.splice(index, 1);
            return curr;
        });
        setDeleteData((curr) => {
            let temp = curr;
            const result = temp.find(el => el.exerciseId === id)?.data.push(index);
            if (result === undefined) {
                temp.push({exerciseId: id, data: [index]});
            }
            return temp
        })
    }
    const editExerciseWR = (id, updateData) => {
        setUpdateData((curr) => {
            curr.find(el => el.exerciseId === id).w_r = updateData;
            return curr;
        });
    }
    const editExerciseName = (id, name) => {
        setUpdateData((curr) => {
            curr.find(el => el.exerciseId === id).exerciseName = name;
            return curr;
        });
    }

    const addLiftProp = () => {
        const newElement: weightsData = {
            exerciseId: new ObjectId(),
            w_r: [],
            exerciseName: '',
            weightRepId: new ObjectId()
        }
        setUpdateData((curr)=>[...curr,newElement]);
        addLift(newElement);
    }

    const saveOnExit = () => {
        async function submitData() {
            const requestData = updateData.filter(el => el !== null);
            let res = await fetch(`http://localhost:3000/api/day/${resource}`, {
                method: "POST",
                headers: {'Set-Cookie': document.cookie},
                body: JSON.stringify({
                    save_data: requestData,
                    exerciseId: exerciseId
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

        submitData()
    }
    return (<>
        <div>{showExercises()}</div>
        <div onClick={() => addLiftProp()}
             className="btn m-2 w-100 border border-green-400 rounded-lg h-20 text-center text-green-400 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
            <Plus_Icon/>
        </div>
    </>);
}
