import Link from "next/link";

export default async function Day({exerciseData}) {
    return (<Link href={`/day/${exerciseData.name}`}>
        <div
            className="m-2 w-100 border rounded-lg h-20 text-center bg-clear hover:bg-white hover:text-black cursor-pointer">
            <h2 className="text-3xl pt-5">{exerciseData.name}</h2></div>
    </Link>);
}
