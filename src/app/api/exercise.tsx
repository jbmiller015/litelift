import clientPromise from "@/lib/mongodb";
import {NextApiRequest, NextApiResponse} from "next";
import {ObjectId} from "bson";

export default async (req: NextApiRequest, res: NextApiResponse) => {

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
