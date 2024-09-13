import clientPromise from "@/lib/mongodb";
import {NextApiRequest, NextApiResponse} from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let data = await clientPromise;
        const db = data.db(process.env.DB_NAME);
        const excerciseData = await db.collection(process.env.EXCERCISE_COL).find({user: sessionStorage.getItem("user")}).toArray();
        res.json(excerciseData);
    } catch (e) {
        console.log(e)
    }
}
