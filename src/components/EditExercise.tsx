import {useEffect, useState} from "react";
import Weight from "./Weight";
import {string} from "prop-types";

interface EditProps {
    weightsData: string[],
    edit: boolean,
    key: String
}

export default function editExercise({weightsData = [], edit = false, key}: EditProps) {

    const [weights, setWeights] = useState(weightsData);
    const [editExercise, setEditExercise] = useState(edit);
    useEffect(() => {
        if (weights.length < 1) {
            addWeight();
        }
        setEditExercise(edit)
    }, [edit]);
    console.log("renderexercise")

    const showWeight = () => {
        return weights
    }

    const addWeight = () => {
        setWeights([...weights, <Weight edit={editExercise}/>]);
    }

    const editWeights = () => {
        setEditExercise(true);
    }

    const submitWeights = () => {
        setEditExercise(false);
        //Post to store
    }
    return (
        <div className="" key={key}>
            <form className="flex flew-row flex-wrap max-w-sm mx-auto">
                <div>
                    <input type="text" id="exercise" aria-describedby="editExercise-name" placeholder="Exercise"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block min-w-[10rem] w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                    />
                </div>
                <div>
                    <div className="flex flew-col flex-wrap max-w-sm mx-auto">{showWeight()}</div>
                </div>
                <div onClick={() => addWeight()}
                     className="text-gray-700 border border-gray-700   font-medium rounded-lg text-sm p-2 text-center inline-flex items-center me-2 dark:border-gray-500 dark:text-gray-500 dark:">
                    <svg className="w-10 h-6 text-gray-900 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 1v16M1 9h16"/>
                    </svg>
                    Add to Set
                </div>
                {!editExercise ? <div onClick={() => editWeights()}
                                      className="text-gray-700 border border-gray-700 font-medium rounded-lg text-lg p-2 text-center inline-flex items-center me-2 dark:border-gray-500 dark:text-gray-500 dark:">
                        <svg className="w-10 h-6 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round"></path>
                            <path
                                d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round"></path>
                        </svg>
                        Edit Set
                    </div> :
                    <div onClick={() => submitWeights()}
                         className="text-gray-700 border border-gray-700 font-medium rounded-lg text-lg p-2 text-center inline-flex items-center me-2 dark:border-gray-500 dark:text-gray-500 dark:">
                        <svg className="w-10 h-6 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="currentColor" strokeWidth="2"
                                  strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        Save Set
                    </div>
                }
            </form>

        </div>)
        ;
}
