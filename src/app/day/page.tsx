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

export default async function Day() {
    //const data = await clientPromise;
    let exerciseData: any[] = exampleData;
    try {
        //const db = data.db(process.env.DB_NAME);
        //let collectionName: string = process.env.EXCERCISE_COL;
        //exerciseData = await db.collection(collectionName).find({}).toArray();
        //console.log("exerciseData", exerciseData)
    } catch (e) {
        console.log('error: ', e)
    }
    return (<div>

    </div>);
}
