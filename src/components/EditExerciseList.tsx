import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {ObjectId} from "bson";
import Plus_Icon from "@/assets/icon/plus_icon";
import EditExercise from "@/components/EditExercise";

//import exerciseData from "/Example_Data.json";

interface weightsData {
    exerciseId: ObjectId | string,
    w_r: [{ weight: number, reps: number, status: string }] | [],
    exerciseName: string | '',
    weightRepId: ObjectId | string
}


export default function EditExerciseList({exerciseData = [], editLift, addLift, deleteLift}) {
    const [updateData, setUpdateData] = useState<(weightsData | null)[]>(exerciseData);
    const [deleteData, setDeleteData] = useState<[{ exerciseId: ObjectId, data: string[] }]>([]);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    let resource = pathname.slice('/day/'.length);

    const showExercises = () => {
        return updateData.map((exercise, i) => {
            if (exercise != null) {
                return (<div key={`editExercise${i}`}>
                    <EditExercise weightsData={exercise} editExerciseWR={editExerciseWR}
                                  deleteExerciseWR={deleteExerciseWR}
                                  deleteLift={() => {
                                      deleteLiftProp(exercise.exerciseId);
                                  }} addExerciseWR={addExerciseWR} editExerciseName={editExerciseName}/></div>)
            }
        })
    }


    const deleteLiftProp = (id) => {
        setUpdateData((curr) => {
            return curr.map((el) => {
                if (el && el.exerciseId.toString() === id.toString()) {
                    return null;
                } else return el
            });
        })
        deleteLift(id);
    }
    const addExerciseWR = (id, value) => {
        setUpdateData((curr) => {
            curr.find(el => el && el.exerciseId.toString() === id.toString())?.w_r.push(value);
            return curr;
        });
    }
    const deleteExerciseWR = (id, index) => {
        console.log(index, id);
        setUpdateData((curr) => {
            curr.find(el => el && el.exerciseId.toString() === id.toString()).w_r[index] = null;
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

        editLift(id, null, deleteData);
    }
    const editExerciseWR = (id, updateData) => {
        setUpdateData((curr) => {
            curr.find(el => el && el.exerciseId.toString() === id.toString()).w_r = updateData;
            return curr;
        });

        editLift(id, updateData);
    }
    const editExerciseName = (id, name) => {
        setUpdateData((curr) => {
            curr.find(el => el && el.exerciseId.toString() === id.toString()).exerciseName = name;
            return curr;
        });
        editLift(id, name);
    }

    const addLiftProp = () => {
        const newElement: weightsData = {
            exerciseId: new ObjectId().toString(),
            w_r: [],
            exerciseName: '',
            weightRepId: new ObjectId().toString()
        }
        setUpdateData((curr) => [...curr, newElement]);
        addLift(newElement);
    }

    return (<>
        <div>{showExercises()}</div>
        <div onClick={() => addLiftProp()}
             className="btn m-2 w-100 border border-green-400 rounded-lg h-20 text-center text-green-400 bg-transparent hover:bg-green-100 hover:text-green-900 cursor-pointer flex flex-col items-center justify-center">
            <Plus_Icon/>
        </div>
    </>);
}
