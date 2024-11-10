import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import {cookies} from 'next/headers'
import {ObjectId} from "bson";

interface JwtPayloadResult {
    payload: { userId: string }
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
    const headerCookie = request.headers.get('cookie').split('=');
    const cookieStore = cookies();
    cookieStore.set(headerCookie[0], headerCookie[1]);
    const token = cookieStore.get('token')?.value;
    try {
        if (token && token !== 'demo') {
            const payload = await jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET_KEY, async (err, payload) => {
                if (err) {
                    console.log(err)
                    return Response.json('You must be logged in.', {statusText: "Error", status: 401});
                }
                return payload.payload;
            });
            const {userId} = payload;
            const userIdObject = new ObjectId(userId);
            try {
                const reqData = await request.json();
                const deleteData = reqData.delete_data;
                const editData = reqData.edit_data;
                const payload = editData.map((el) => {
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
                let bulkOps = payload.map(el => {
                    return el._id ? {
                        updateOne: {
                            "filter": {_id: el._id, user_id: el.user_id},
                            "update": {$set: {name: el.name, exerciseData: el.exerciseData}},
                            "upsert": true
                        }
                    } : {
                        insertOne: {"document": {name: el.name, exerciseData: el.exerciseData, user_id: el.user_id}}
                    }
                })
                bulkOps.push(...deleteData.map((el) => {
                    const _id = new ObjectId(el);
                    return {
                        deleteOne: {
                            "filter": {_id},
                        }
                    }
                }))
                const data = await clientPromise;
                const db = data.db(process.env.NEXT_PUBLIC_DB_NAME);
                const day = await db.collection(process.env.NEXT_PUBLIC_DAY_COL).bulkWrite(bulkOps);
                return Response.json(day, {statusText: "success", status: 200});
            } catch (e) {
                console.log(e)
                return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
            }
        }
    } catch (err) {
        console.log(err)
        return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
    }

}
