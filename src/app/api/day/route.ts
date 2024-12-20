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
            const payload = jwt.verify(token, jwt_key) as unknown as JwtPayloadResult;
            if (!payload) {
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
                    day = await db.collection(dayColName).find({user_id: userIdObject}).toArray();
                });
                session.endSession();
                return Response.json(day, {statusText: "success", status: 200});
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
                const {delete_data, edit_data} = await request.json() as ExDataPutRequest;


                const exEdit = edit_data.map((el) => {
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
                const isUpdate: AnyBulkWriteOperation<Document>[] = exEdit.map((el) => {
                    return el._id ? ({
                        updateOne: {
                            filter: {_id: el._id, user_id: el.user_id},
                            update: {$set: {name: el.name, exerciseData: el.exerciseData}},
                            upsert: true
                        }
                    } as unknown as AnyBulkWriteOperation<Document>) : ({
                        insertOne: {
                            document: {name: el.name, exerciseData: el.exerciseData, user_id: el.user_id},

                        }
                    } as unknown as AnyBulkWriteOperation<Document>)
                })

                const bulkOps: AnyBulkWriteOperation<Document>[] = [...isUpdate];
                const deleteDay = delete_data.map((el) => {
                    const _id = new ObjectId(el);
                    return {
                        deleteOne: {
                            "filter": {_id},
                        }
                    } as AnyBulkWriteOperation<Document>
                })
                bulkOps.push(...deleteDay);
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
                    day = await db.collection(dayColName).bulkWrite(bulkOps);
                });
                session.endSession();
                return Response.json(day, {statusText: "success", status: 200});

            }

        } catch (err) {
            console.log(err)
            return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
        }
    }
}
