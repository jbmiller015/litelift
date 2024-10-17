import clientPromise from "@/lib/mongodb";
import {NextApiRequest, NextApiResponse} from "next";
import {ObjectId} from "bson";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    console.log(req.body)
    try {
        const data = await clientPromise;
        const db = data.db(process.env.DB_NAME);
        sessionStorage.setItem("user", "66e0fff387e6536421d071f6");
        const excerciseData = await db.collection('day').aggregate(agg).toArray();
        res.status(200).json(excerciseData);
    } catch (e) {
        console.log('error: ', e)
    }
}




