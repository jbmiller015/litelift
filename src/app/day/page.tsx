'use client'
import ExerciseList from "@/components/ExerciseList";
import clientPromise from "@/lib/mongodb";

export default async function Day(props) {

    //getData
    return <div>
        <div>List</div>
        <ExerciseList exerciseData={[]}/>
    </div>;
}
