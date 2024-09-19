import clientPromise from "@/lib/mongodb";
import {NextApiRequest, NextApiResponse} from "next";
import {ObjectId} from "bson";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    /**
     * {"_id":{"$oid":"66e0fee187e6536421d071f4"},"user_id":{"$oid":"66e0fff387e6536421d071f6"},"w_r":[{"weight":{"$numberDouble":"30.5"},"reps":{"$numberInt":"3"},"complete":false,"fail":false},{"weight":{"$numberDouble":"42.0"},"reps":{"$numberInt":"4"},"complete":false,"fail":false}],"name":"Squat"}
     */
    try {
        const data = await clientPromise;
        const db = data.db(process.env.DB_NAME);
        sessionStorage.setItem("user", "66e0fff387e6536421d071f6");
        let collectionName: string = process.env.EXCERCISE_COL;
        const excerciseData = await db.collection(collectionName).find({user: new ObjectId(sessionStorage.getItem("user"))}).toArray();
        res.json(excerciseData);
    } catch (e) {
        console.log('error: ', e)
    }
}
