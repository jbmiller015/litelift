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
                const agg = [
                    {
                        '$match': {
                            'user_id': userIdObject
                        }
                    }, {
                        '$lookup': {
                            'from': 'exercise',
                            'localField': 'exerciseData',
                            'foreignField': '_id',
                            'as': 'exerciseData'
                        }
                    }
                ];
                const day = await db.collection('day').aggregate(agg).toArray();
                return Response.json(day[0], {statusText: "success", status: 200});
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
