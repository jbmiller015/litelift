import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import {cookies} from 'next/headers'
import {Document, ObjectId} from "bson";
import {StatusCode} from "@/context/ExerciseContext";
import {AnyBulkWriteOperation} from "mongodb";

interface JwtPayloadResult {
    payload: { userId: string }
}

interface WeightReps {
    weight: number;
    reps: number;
    status: StatusCode;
}

interface Exercise {
    _id: ObjectId | string | undefined;
    user_id: ObjectId | string | undefined;
    w_r: WeightReps[];
    name: string;
}

interface ExData {
    exerciseData: Exercise[];
    name: string;
    user_id: ObjectId;
    _id: ObjectId;
}

interface ExDataRequest {
    exerciseData: ExData,
    deleteData: string[]
}

async function getCookieData(key: string) {
    const cookieData = cookies().get(key)?.value;
    return new Promise<string | undefined>((resolve) =>
        setTimeout(() => {
            resolve(cookieData)
        }, 1000)
    )
}

async function setCookieData(key: string, value: string) {
    const cookieData = cookies().set(key, value);
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve(cookieData)
        }, 1000)
    )
}

export async function PUT(request: Request) {
    const cookieHeader: string | null = request.headers.get('cookie');
    if (!cookieHeader) {
        return Response.json('You must be logged in.', {statusText: "Error", status: 401});
    }
    const headerCookie: string[] = cookieHeader.split('=');
    if (headerCookie) {
        try {
            await setCookieData(headerCookie[0], headerCookie[1]);
        } catch (err) {
            console.log(err)
        }
    }
    let token;
    try {
        token = await getCookieData('token');
    } catch (err) {
        console.log(err)
    }
    const data = await clientPromise;
    try {
        if (token && token !== 'demo') {
            const jwt_key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
            if (!jwt_key) {
                throw new Error("JWT secret key is not set in environment variables");
            }
            const payload = await jwt.verify(token, jwt_key) as JwtPayloadResult;
            if (!payload) {
                return Response.json('You must be logged in.', {statusText: "Error", status: 401});
            }
            if ("payload" in payload) {
                const {userId} = payload.payload;
                const userIdObject = new ObjectId(userId);
                try {
                    const {exerciseData, deleteData} = await request.json() as ExDataRequest;
                    exerciseData.exerciseData.forEach(ex => {
                        return ex.w_r = ex.w_r.map((el) => {
                            return {...el, "weight": Number(el.weight), reps: Number(el.reps)}
                        });
                    })
                    console.log(exerciseData)
                    console.log(deleteData)
                    //TODO: Create request for:
                    // 1. New Lift: Create new wr record and add to day.
                    // 2. Change Lift Property: Edit existing wr record.
                    // 3. Delete Lift: Delete wr record and delete from day.
                    // 4. Create new exercise if name change or new.


                    //Exercise Ops
                    const updateExercise = exerciseData.exerciseData.map((el) => {
                        return {
                            updateOne: {
                                "filter": {_id: new ObjectId(el._id), user_id: userIdObject},
                                "update": {$set: {name: el.name, w_r: el.w_r}, $setOnInsert: {user_id: userIdObject}},
                                "upsert": true
                            }
                        } as unknown as AnyBulkWriteOperation<Document>
                    });

                    console.log(updateExercise)
                    const deleteExercise = deleteData.map((el) => {
                        return {
                            deleteOne: {
                                "filter": {_id: new ObjectId(el), user_id: userIdObject}
                            }
                        } as unknown as AnyBulkWriteOperation<Document>
                    });

                    console.log(deleteExercise);
                    //Day Ops
                    const deleteExerciseFromDay = deleteData.map((el) => {
                        return {
                            updateOne: {
                                "filter": {_id: new ObjectId(exerciseData._id), user_id: userIdObject},
                                "update": {$pull: {exerciseData: new ObjectId(el)}}
                            }
                        } as unknown as AnyBulkWriteOperation<Document>
                    });
                    console.log(deleteExerciseFromDay)
                    const updateExerciseInDay = {
                        updateOne: {
                            "filter": {_id: new ObjectId(exerciseData._id), user_id: userIdObject},
                            "update": {
                                $set: {
                                    exerciseData: exerciseData.exerciseData.map((el) => {
                                        el._id = new ObjectId(el._id);
                                        return el._id;
                                    })
                                }
                            }
                        }
                    } as AnyBulkWriteOperation<Document>

                    const exerciseBulkOps: AnyBulkWriteOperation<Document>[] = [];
                    const dayBulkOps: AnyBulkWriteOperation<Document>[] = [];
                    exerciseBulkOps.push(...updateExercise, ...deleteExercise)
                    dayBulkOps.push(updateExerciseInDay, ...deleteExerciseFromDay)
                    let day = {};
                    let exercise = {};

                    const session = data.startSession();
                    await session.withTransaction(async () => {
                        let dbName: string;
                        let dayColName: string;
                        let exerciseColName: string;
                        if (process.env.NEXT_PUBLIC_DB_NAME) {
                            dbName = process.env.NEXT_PUBLIC_DB_NAME;
                        } else throw new Error('DB name variable not set');
                        if (process.env.NEXT_PUBLIC_DAY_COL) {
                            dayColName = process.env.NEXT_PUBLIC_DAY_COL;
                        } else throw new Error('Day Column variable not set');
                        if (process.env.NEXT_PUBLIC_EXERCISE_COL) {
                            exerciseColName = process.env.NEXT_PUBLIC_EXERCISE_COL;
                        } else throw new Error('Exercise Column variable not set');
                        const db = data.db(dbName);
                        day = await db.collection(dayColName).bulkWrite(dayBulkOps);
                        exercise = await db.collection(exerciseColName).bulkWrite(exerciseBulkOps);
                    });
                    session.endSession();

                    return Response.json(JSON.stringify({day, exercise}), {statusText: "success", status: 200});
                } catch (e) {
                    console.log(e)
                    return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
                }
            }
        }
    } catch (err) {
        console.log(err)
        return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
    }

}
