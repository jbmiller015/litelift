import Link from "next/link";
import {ObjectId} from "bson";

interface ExData {
    exerciseData: ObjectId[];
    name: string;
    user_id: ObjectId;
    _id: ObjectId;
}


interface DayParams {
    exerciseData: ExData;
}

export default async function Day({exerciseData}: DayParams) {
    return (<Link href={`/day/${exerciseData.name}`}>
        <div
            className="m-2 w-100 border rounded-lg h-20 text-center bg-clear hover:bg-white hover:text-black cursor-pointer">
            <h2 className="text-3xl pt-5">{exerciseData.name}</h2></div>
    </Link>);
}
