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

interface ExDataPutRequest {
    edit_data: ExData[],
    delete_data: string[]
}

interface ExDataPostRequest {
    exerciseData: ExData,
}

const createGETAgg = (objectId: ObjectId, resource: string) => {
    return ([
        {
            '$match': {
                'user_id': objectId,
                'name': resource
            }
        }, {
            '$lookup': {
                'from': 'exercise',
                'localField': 'exerciseData',
                'foreignField': '_id',
                'as': 'exerciseData'
            }
        }
    ]);
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

export async function GET(request: Request) {
    const headerCookie = request.headers?.get('cookie')?.split('=');
    const path = request.url.split('/');
    let resource = path[path.length - 1];
    if (resource && resource !== '' && resource.includes('%20')) {
        resource = resource.replace('%20', ' ');
    }
    console.log(resource)
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
    if (token && token !== 'demo') {
        try {

            const jwt_key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
            if (!jwt_key) {
                throw new Error("JWT secret key is not set in environment variables");
            }
            const payload = jwt.verify(token, jwt_key) as JwtPayloadResult;
            console.log(payload)
            if (!payload) {
                console.log("error")
                return Response.json('You must be logged in.', {statusText: "Error", status: 401});
            }
            if ("payload" in payload) {
                const {userId} = payload.payload;
                const userIdObject = new ObjectId(userId);
                const data = await clientPromise;
                const session = data.startSession();
                let day: unknown[] = [];
                await session.withTransaction(async () => {
                    let dbName: string;
                    let dayColName: string;
                    if (process.env.NEXT_PUBLIC_DB_NAME) {
                        dbName = process.env.NEXT_PUBLIC_DB_NAME;
                    } else throw new Error('DB name variable not set');
                    if (process.env.NEXT_PUBLIC_DAY_COL) {
                        dayColName = process.env.NEXT_PUBLIC_DAY_COL;
                    } else throw new Error('Day Column variable not set');

                    const db = data.db(dbName);

                    //Dynamically set user filter
                    const agg = createGETAgg(userIdObject, resource);
                    day = await db.collection(dayColName).aggregate(agg).toArray();
                    console.log(day[0])
                })
                session.endSession();
                //Return first match
                return Response.json(day.length > 0 ? day[0] : null, {statusText: "success", status: 200});
            }

        } catch (err) {
            console.log(err)
            return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
        }
    }
}

export async function PUT(request: Request) {
    const headerCookie = request.headers?.get('cookie')?.split('=');
    const cookieStore = cookies();
    if (headerCookie) {
        cookieStore.set(headerCookie[0], headerCookie[1]);
    }
    const token = cookieStore.get('token')?.value;
    if (token && token !== 'demo') {
        try {
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

                const {edit_data, delete_data} = await request.json() as ExDataPutRequest;
                console.log(edit_data, delete_data)
                const exData = edit_data.map((el) => {
                    if (!el.user_id) {
                        el.user_id = userIdObject;
                    } else if (el.user_id) {
                        el.user_id = new ObjectId(el.user_id);
                    }
                    if (el._id) {
                        el._id = new ObjectId(el._id);
                    }
                    return el;
                })

                const editDayData = exData.filter(el => el._id);
                const saveDayData = exData.filter(el => !el._id);

                const editDay: AnyBulkWriteOperation<Document>[] = editDayData.map((el) => {
                    return {
                        updateOne: {
                            "filter": {_id: el._id, user_id: el.user_id},
                            "update": {$set: {name: el.name, exerciseData: el.exerciseData}},
                            "upsert": true
                        }
                    } as unknown as AnyBulkWriteOperation<Document>
                })

                const saveDay: AnyBulkWriteOperation<Document>[] = saveDayData.map(el => {
                    return {
                        insertOne: {
                            "document": {
                                name: el.name,
                                exerciseData: el.exerciseData,
                                user_id: el.user_id
                            }
                        }
                    } as unknown as AnyBulkWriteOperation<Document>
                })

                const deleteDay: AnyBulkWriteOperation<Document>[] = delete_data.map((el) => {
                    const _id = new ObjectId(el);
                    return {
                        deleteOne: {
                            "filter": {_id},
                        }
                    } as AnyBulkWriteOperation
                })
                const bulkOps: AnyBulkWriteOperation<Document>[] = [];

                bulkOps.push(...editDay, ...saveDay, ...deleteDay);
                let day = {};
                const data = await clientPromise;
                const session = data.startSession();
                await session.withTransaction(async () => {
                    let dbName: string;
                    let dayColName: string;
                    if (process.env.NEXT_PUBLIC_DB_NAME) {
                        dbName = process.env.NEXT_PUBLIC_DB_NAME;
                    } else throw new Error('DB name variable not set');
                    if (process.env.NEXT_PUBLIC_DAY_COL) {
                        dayColName = process.env.NEXT_PUBLIC_DAY_COL;
                    } else throw new Error('Day Column variable not set');

                    const db = data.db(dbName);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    day = await db.collection(dayColName).bulkWrite(bulkOps);
                });
                session.endSession();
                return Response.json(day, {statusText: "success", status: 200});

            }
        } catch
            (err) {
            console.log(err)
            return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
        }
    }
}

export async function POST(request: Request) {
    const headerCookie = request.headers?.get('cookie')?.split('=');
    const cookieStore = cookies();
    if (headerCookie) {
        cookieStore.set(headerCookie[0], headerCookie[1]);
    }
    const token = cookieStore.get('token')?.value;
    if (token && token !== 'demo') {
        try {
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

                const {exerciseData} = await request.json() as ExDataPostRequest;
                const exData = exerciseData.exerciseData.map((el) => {
                    if (!el.user_id) {
                        el.user_id = userIdObject;
                    } else if (el.user_id) {
                        el.user_id = new ObjectId(el.user_id);
                    }
                    if (el._id) {
                        el._id = new ObjectId(el._id);
                    }
                    return el;
                });

                const bulkOps: AnyBulkWriteOperation<Document>[] = exData.map(el => {
                    return {
                        updateOne: {
                            "filter": {_id: el._id, user_id: userIdObject},
                            "update": {$set: {w_r: el.w_r}},
                            "upsert": true
                        }
                    } as AnyBulkWriteOperation
                })
                const data = await clientPromise;
                const session = data.startSession();
                let w_rData = {};
                let saveResult = {};
                await session.withTransaction(async () => {
                    let dbName: string;
                    let exerciseColName: string | undefined;
                    let historyColName: string | undefined;
                    if (process.env.NEXT_PUBLIC_DB_NAME) {
                        dbName = process.env.NEXT_PUBLIC_DB_NAME;
                    } else throw new Error('DB name variable not set');
                    if (process.env.NEXT_PUBLIC_DAY_COL) {
                        exerciseColName = process.env.NEXT_PUBLIC_EXERCISE_COL;
                    } else throw new Error('Exercise Column variable not set');
                    if (process.env.NEXT_PUBLIC_DAY_COL) {
                        historyColName = process.env.NEXT_PUBLIC_HISTORY_COL;
                    } else throw new Error('History Column variable not set');
                    if (dbName && exerciseColName && historyColName) {
                        const db = data.db(dbName);

                        w_rData = await db.collection(exerciseColName).bulkWrite(bulkOps);

                        saveResult = await db.collection(historyColName).updateOne({user_id: userIdObject}, {
                            $push: {
                                "history": {
                                    $each: [{
                                        date: new Date(),
                                        exerciseData: exData,
                                    }],
                                    $slice: -10
                                }
                            } as Document
                        });
                    }
                });
                session.endSession();
                return Response.json({w_rData, saveResult}, {statusText: "success", status: 200});


            }
        } catch
            (err) {
            console.log(err)
        }
    }
}
