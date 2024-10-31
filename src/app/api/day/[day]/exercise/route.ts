import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import {cookies} from 'next/headers'
import {ObjectId} from "bson";


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
                console.log(reqData)
                //TODO: Create request for:
                // 1. New Lift: Create new wr record and add to day.
                // 2. Change Lift Property: Edit existing wr record.
                // 3. Delete Lift: Delete wr record and delete from day.
                // 4. Create new exercise if name change or new.
                const exerciseRequestArray = reqData.exerciseData.map(({exerciseId, exerciseName}) => ({
                    exerciseId: new ObjectId(exerciseId),
                    exerciseName,
                    user_id: userIdObject
                }));

                const weightRequestArray = reqData.exerciseData.map(({weightRepId, w_r}) => ({
                    weightRepId: new ObjectId(weightRepId),
                    w_r,
                    user_id: userIdObject
                }));

                //Day Ops
                const deleteWRPropRequestArray = reqData.deleteData.map((el) => {
                    return {
                        updateOne: {
                            "filter": {_id: new ObjectId(reqData.day_id),user_id: userIdObject},
                            "update": {$pull:{exerciseData: new ObjectId(el)}}
                        }
                    }
                })

                //WeightReps Ops
                const deleteWRRequestArray = reqData.deleteData.map((el) => {
                    return {
                        deleteOne: {
                            "filter": {_id: new ObjectId(el),user_id: userIdObject},
                        }
                    }
                })

                //Exercise Ops
                const insertExercise = reqData.exerciseData.map(({exerciseName}) => {
                    return {
                        updateOne: {
                            "filter": {name:exerciseName},
                            "update": {$setOnInsert: {name: exerciseName}},
                            "upsert":true
                        }
                    }
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
                const session = data.startSession();
                await session.withTransaction(async () => {
                    //const db = data.db(process.env.DB_NAME);
                    //const day = await db.collection(process.env.DAY_COL).bulkWrite(bulkOps);
                });
                session.endSession();
                return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
                return Response.json(true, {statusText: "success", status: 200});
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
