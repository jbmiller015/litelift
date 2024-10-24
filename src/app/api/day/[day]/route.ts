import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import {cookies} from 'next/headers'
import {ObjectId} from "bson";

const createGETAgg = (objectId: ObjectId, resource: string) => {
    return ([
        {
            '$match': {
                'user_id': objectId,
                'name': resource
            }
        }, {
            '$lookup': {
                'from': 'weightRep',
                'localField': 'exerciseData',
                'foreignField': '_id',
                'as': 'weightRepData'
            }
        }, {
            '$unwind': {
                'path': '$weightRepData',
                'includeArrayIndex': 'string',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$lookup': {
                'from': 'exercise',
                'localField': 'weightRepData.exercise_id',
                'foreignField': '_id',
                'as': 'exerciseData'
            }
        }, {
            '$unwind': {
                'path': '$exerciseData',
                'includeArrayIndex': 'string',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$group': {
                '_id': '$_id',
                'name': {
                    '$first': '$name'
                },
                'user_id': {
                    '$first': '$user_id'
                },
                'exerciseData': {
                    '$push': {
                        'weightRepId': '$weightRepData._id',
                        'exerciseName': '$exerciseData.name',
                        'exerciseId': '$exerciseData._id',
                        'w_r': '$weightRepData.w_r'
                    }
                }
            }
        }
    ]);
}


export async function GET(request: Request) {
    const headerCookie = request.headers.get('cookie').split('=');
    const path = request.url.split('/');
    const resource = path[path.length - 1];
    console.log(resource);
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
                //Dynamically set user filter
                const agg = createGETAgg(userIdObject, resource);
                const day = await db.collection(process.env.DAY_COL).aggregate(agg).toArray();
                //Only return one resource/first match
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

export async function POST(request: Request) {
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
                console.log(reqData);
                const saveData = reqData.save_data;
                console.log(saveData);
                //prepare to store in history and update w/r
                const payload = saveData.map((el) => {
                    if (!el.user_id) {
                        el.user_id = userIdObject;
                    } else if (el.user_id) {
                        el.user_id = new ObjectId(el.user_id);
                    }
                    if (el.weightRepId) {
                        el.weightRepId = new ObjectId(el.weightRepId);
                    }
                    if (el.exerciseId) {
                        el.exerciseId = new ObjectId(el.exerciseId);
                    }
                    return el;
                })
                let bulkOps = payload.map(el => {
                    return {
                        updateOne: {
                            "filter": {_id: el.weightRepId, user_id: el.user_id},
                            "update": {$set: {w_r: el.w_r}},
                            "upsert": true
                        }
                    }
                })
                const data = await clientPromise;
                const db = data.db(process.env.DB_NAME);
                const w_rData = await db.collection(process.env.WR_COL).bulkWrite(bulkOps);

                const saveResult = await db.collection(process.env.HISTORY_COL).updateOne({user_id: userIdObject}, {
                    $push: {
                        "history": {
                            date: new Date(),
                            exerciseData: payload,
                        }
                    }
                })
                return Response.json('Ok', {statusText: "success", status: 200});
            } catch (err) {
                console.log(err)
            }
        }
    } catch (err) {
        console.log(err)
    }
}
