import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import {cookies} from 'next/headers'

import {ObjectId} from "bson";

export async function GET(request: Request) {
    const headerCookie = request.headers.get('cookie').split('=');
    const cookieStore = cookies();
    cookieStore.set(headerCookie[0], headerCookie[1]);
    const token = cookieStore.get('token')?.value;
    try {
        if (token && token !== 'demo') {
            const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (err) {
                    console.log(err)
                    return Response.json('You must be logged in.', {statusText: "Error", status: 401});
                }
                return payload.payload;
            });
            const {userId} = payload;
            try {
                const data = await clientPromise;
                const db = data.db(process.env.DB_NAME);
                const userIdObject = new ObjectId(userId);
                const day = await db.collection(process.env.DAY_COL).find({user_id: userIdObject}).toArray();
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

export async function PUT(request: Request) {
    const headerCookie = request.headers.get('cookie').split('=');
    const cookieStore = cookies();
    cookieStore.set(headerCookie[0], headerCookie[1]);
    const token = cookieStore.get('token')?.value;
    try {
        if (token && token !== 'demo') {
            const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
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
                const payload = reqData.map((el) => {
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
                const bulkOps = payload.map(el => {
                    return el._id ? {
                        updateOne: {
                            "filter": {_id: el._id},
                            "update": {$set: {name: el.name, exerciseData: el.exerciseData}},
                            "upsert": true
                        }
                    } : {
                        insertOne: {"document": {name: el.name, exerciseData: el.exerciseData, user_id: el.user_id}}
                    }
                })
                const data = await clientPromise;
                const db = data.db(process.env.DB_NAME);
                const day = await db.collection(process.env.DAY_COL).bulkWrite(bulkOps);
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
