'use client'
import exampleData from '/Example_Data.json'
//import type {InferGetStaticPropsType, GetStaticProps} from 'next'
import ExerciseList from "@/components/ExerciseList";
//import clientPromise from "@/lib/mongodb";
//import {ObjectId} from "bson";
import Exercise from "@/components/Exercise";

/**
 type ExcerciseData = {
 name: string
 stargazers_count: number
 }

 export async function getStaticProps() {
 const res = await fetch('127.0.0.1:3000/api/exercise/')
 const exerciseData = await res.json()
 return {props: {exerciseData}}
 }*/

export default function Day(props) {
    //const data = await clientPromise;
    let exerciseData: {} = exampleData.filter((data)=> {
        return data.name === props.params.lift.replaceAll('%20',' ')
    })[0];
    console.log(props)
    return (<div className="text-center">
        <h2 className="text-5xl my-4">{exerciseData.name}</h2>
        <ExerciseList exerciseData={exerciseData.exerciseData}/>
    </div>);
}
