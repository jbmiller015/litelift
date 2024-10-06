import Link from "next/link";
import Cross_Icon from "@/assets/icon/cross_icon";

export default function EditDay({exerciseData}) {
    return (<Link href={`/day/${exerciseData.name}`} key={exerciseData.name}>
        <div
            className="m-2 w-100 p-5 border rounded-lg h-20 text-center bg-clear flex flex-row justify-between items-center">
            <h2 className="text-3xl ">{exerciseData.name}</h2>
            <div
                className="btn w-14 h-14 h-full rounded-lg h-20 text-center bg-red-400 bg-transparent hover:bg-red-100 hover:text-red-900 bg-clip-text">
                <Cross_Icon/></div>
        </div>

    </Link>);
}
