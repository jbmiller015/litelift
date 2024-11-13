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
    exerciseData: ExData,
    deleteData: string[]
}

export async function GET(request: Request) {
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
                const reqData = await request.json() as ExDataPutRequest;
                const deleteData = reqData.deleteData;
                const editData = reqData.exerciseData;

                const exEdit = editData.exerciseData.map((el) => {
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
                const isUpdate = editData._id ? ({
                    updateOne: {
                        filter: {_id: editData._id, user_id: editData.user_id},
                        update: {$set: {name: editData.name, exerciseData: exEdit}},
                        upsert: true
                    }
                }) : ({
                    insertOne: {
                        document: {name: editData.name, exerciseData: exEdit, user_id: editData.user_id},

                    }
                })

                const bulkOps: AnyBulkWriteOperation<Document>[] = [isUpdate as AnyBulkWriteOperation<Document>];
                const deleteDay = deleteData.map((el) => {
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
