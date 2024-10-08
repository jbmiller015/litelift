import clientPromise from "@/lib/mongodb";
import {NextApiRequest, NextApiResponse} from "next";
import {ObjectId} from "bson";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const data = await clientPromise;
        const db = data.db(process.env.DB_NAME);
        sessionStorage.setItem("user", "66e0fff387e6536421d071f6");
        const excerciseData = await db.collection('day').aggregate(agg).toArray();
        res.json(excerciseData);
    } catch (e) {
        console.log('error: ', e)
    }
}


const agg = [
    {
        '$match': {
            'user_id': new ObjectId(sessionStorage.getItem("user"))
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


await client.close();

