// context/ExerciseContext.tsx

import React, {createContext, useContext, useEffect, useState} from 'react';
import {ObjectId} from 'bson';
import {usePathname, useRouter} from 'next/navigation';

export enum StatusCode {
    complete = "complete",
    failed = "failed",
    none = "none"
}

export interface WeightReps {
    weight: number;
    reps: number;
    status: StatusCode;
}

export interface Exercise {
    _id: ObjectId | string | null;
    user_id: ObjectId | string | null;
    w_r: WeightReps[];
    name: string;
}

interface ExData {
    exerciseData: Exercise[];
    name: string;
    user_id: ObjectId;
    _id: ObjectId;
}

interface ExerciseContextProps {
    exerciseData: ExData | null;
    statusCode: typeof StatusCode;
    loading: boolean;
    error: unknown;
    fetchExerciseData: () => void;
    submitExerciseData: () => void;
    saveOnExit: () => void;
    resetWRStatus: () => void;
    updateWeightReps: (exerciseId: string | ObjectId | null, index: number, updatedValue: number | StatusCode, type: "weight" | "reps" | "status") => void;
    addWeightReps: (exerciseId: string | ObjectId | null) => void;
    deleteWeightReps: (exerciseId: string | ObjectId | null, index: number) => void;
    addExercise: () => void;
    editExerciseProp: (exerciseId: string | ObjectId | null, target: string, updatedValue: WeightReps | string) => void;
    deleteExercise: (exerciseId: string | ObjectId | null) => void;
}

const ExerciseContext = createContext<ExerciseContextProps | undefined>(undefined);

export const ExerciseProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [exerciseData, setExerciseData] = useState<ExData | null>(null);
    const [deleteData, setDeleteData] = useState<[string] | []>([]);
    const [changed, setChanged] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const resource = pathname.split('/').pop();

    // Fetch exercise data from API
    const fetchExerciseData = async () => {
        try {
            const base = process.env.NEXT_PUBLIC_BASE_URL;
            if (!base) {
                throw new Error("Base URL not set in environment variables");
            }
            setLoading(true);
            const res = await fetch(`${base}/api/day/${resource}`, {
                method: 'GET',
                headers: {'Set-Cookie': document.cookie},
            });
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            setExerciseData(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Submit exercise data to API
    const submitExerciseData = async () => {
        if (!exerciseData) return;
        const base = process.env.NEXT_PUBLIC_BASE_URL;
        if (!base) {
            throw new Error("Base URL not set in environment variables");
        }
        if (!changed) {
            router.push(`${base}/day/${resource}`);
        }
        try {
            setLoading(true);
            const res = await fetch(`${base}/api/day/${resource}/exercise`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Cookie': document.cookie},
                body: JSON.stringify({exerciseData: exerciseData, deleteData}),
            });
            if (!res.ok) throw new Error('Failed to submit data');
            router.push(`${base}/day/${resource}`);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const saveOnExit = async () => {
        if (!exerciseData) return;
        const base = process.env.NEXT_PUBLIC_BASE_URL;
        if (!base) {
            throw new Error("Base URL not set in environment variables");
        }
        if (!changed) {
            router.push(`${base}/exercises`);
        }
        try {
            const res = await fetch(`${base}/api/day/${resource}`, {
                method: "POST",
                headers: {'Content-Type': 'application/json', 'Cookie': document.cookie},
                body: JSON.stringify({
                    exerciseData
                })
            })
            if (res.ok) {
                router.push(`${base}/exercises`);
            } else {
                const errorBody = await res.json();
                setError({status: res.status, statusText: res.statusText, data: errorBody});
                setLoading(false)
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    // Update weight or reps for a specific exercise
    const updateWeightReps = (exerciseId: string | ObjectId | null, index: number, updatedValue: number | StatusCode, type: 'weight' | 'reps' | 'status') => {
        setExerciseData((prev) => ({
            ...prev,
            exerciseData: prev?.exerciseData.map((ex) => {
                if (ex && ex._id === exerciseId) {
                    const updatedWR = ex.w_r.map((wr, idx) =>
                        idx === index ? {...wr, [type]: updatedValue} : wr
                    );
                    return {...ex, w_r: updatedWR};
                }
                return ex;
            }),
        } as ExData));
        setChanged(true);
    };

    const resetWRStatus = () => {
        setExerciseData((prev) => ({
            ...prev,
            exerciseData: prev?.exerciseData.map((ex) => {
                const updatedWR = ex.w_r.map((wr) => {
                        return {...wr, ['status']: StatusCode.none}
                    }
                );
                return {...ex, w_r: updatedWR};
            }),
        } as ExData));
        setChanged(true);
    }

    // Add a new weight/reps entry to a specific exercise
    const addWeightReps = (exerciseId: string | ObjectId | null) => {
        setExerciseData((prev) => ({
            ...prev,
            exerciseData: prev?.exerciseData.map((ex) =>
                ex?._id === exerciseId
                    ? {...ex, w_r: [...ex.w_r, {weight: 0, reps: 0, status: 'none'}]}
                    : ex
            ),
        } as ExData));
        setChanged(true);
    };

    // Delete a weight/reps entry by index from a specific exercise
    const deleteWeightReps = (exerciseId: string | ObjectId | null, index: number) => {
        console.log(exerciseId, index);
        setExerciseData((prev) => ({
            ...prev,
            exerciseData: prev?.exerciseData.map((ex) =>
                ex?._id === exerciseId
                    ? {...ex, w_r: ex.w_r.filter((_, idx) => idx !== index)}
                    : ex
            ),
        } as ExData));
        setChanged(true);
    };

    // Add a new exercise
    const addExercise = () => {
        const newExercise: Exercise = {
            _id: new ObjectId(),
            user_id: null,
            w_r: [],
            name: ''
        };
        setExerciseData((prev) => ({
            ...prev,
            exerciseData: [...(prev?.exerciseData || []), newExercise],
        } as ExData));
        setChanged(true);
    };

    const editExerciseProp = (exerciseId: string | ObjectId | null, target: string, updatedValue: WeightReps | string) => {
        setExerciseData((prev) => ({
            ...prev,
            exerciseData: prev?.exerciseData.map((ex) => {
                if (ex && ex._id === exerciseId) {
                    return {...ex, [target]: updatedValue};
                }
                return ex;
            }),
        } as ExData));
        setChanged(true);
    }
    // Delete an exercise by weightRepId
    const deleteExercise = (exerciseId: string | ObjectId | null) => {
        setExerciseData((prev) => ({
            ...prev,
            exerciseData: prev?.exerciseData?.filter((ex) => ex?._id !== exerciseId),
        } as ExData));
        setDeleteData((curr) => [...curr, exerciseId] as [string]);
        setChanged(true);
    };

    useEffect(() => {
        fetchExerciseData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource]);

    return (
        <ExerciseContext.Provider
            value={{
                exerciseData,
                statusCode: StatusCode,
                loading,
                error,
                fetchExerciseData,
                submitExerciseData,
                saveOnExit,
                updateWeightReps,
                resetWRStatus,
                addWeightReps,
                deleteWeightReps,
                addExercise,
                editExerciseProp,
                deleteExercise,
            }}
        >
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExerciseContext = () => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useExerciseContext must be used within an ExerciseProvider');
    }
    return context;
};
