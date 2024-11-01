import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import {cookies} from 'next/headers'
import {Double, ObjectId} from "bson";


export async function PUT(request: Request) {
    const headerCookie = request.headers.get('cookie').split('=');
    const cookieStore = cookies();
    cookieStore.set(headerCookie[0], headerCookie[1]);
    const token = cookieStore.get('token')?.value;
    const data = await clientPromise;
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
                let {exerciseData, deleteData} = await request.json();
                exerciseData.exerciseData.forEach(ex => {
                    return ex.w_r = ex.w_r.map((el) => {
                        return {weight: Number(el.weight), reps: Number(el.reps), ...el}
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
                    }
                });

                console.log(updateExercise)
                const deleteExercise = deleteData.map((el) => {
                    return {
                        deleteOne: {
                            "filter": {_id: new ObjectId(el._id), user_id: userIdObject}
                        }
                    }
                });

                console.log(deleteExercise);
                //Day Ops
                const deleteExerciseFromDay = deleteData.map((el) => {
                    return {
                        updateOne: {
                            "filter": {_id: new ObjectId(exerciseData._id), user_id: userIdObject},
                            "update": {$pull: {exerciseData: new ObjectId(el._id)}}
                        }
                    }
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
                }
                console.log(updateExerciseInDay);


                let exerciseBulkOps = [];
                let dayBulkOps = [];
                exerciseBulkOps.push(...updateExercise, ...deleteExercise)
                dayBulkOps.push(updateExerciseInDay, ...deleteExerciseFromDay)
                console.log(exerciseData)
                console.log(dayBulkOps)
                let day = {};
                let exercise = {};

                const session = data.startSession();
                await session.withTransaction(async () => {
                    const db = data.db(process.env.DB_NAME);
                    day = await db.collection(process.env.DAY_COL).bulkWrite(dayBulkOps);
                    exercise = await db.collection(process.env.EXCERCISE_COL).bulkWrite(exerciseBulkOps);
                    console.log(day);
                    console.log(exercise)
                });
                session.endSession();

                return Response.json(JSON.stringify({day, exercise}), {statusText: "success", status: 200});
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
