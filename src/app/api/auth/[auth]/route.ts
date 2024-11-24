import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import {cookies} from 'next/headers'
import {InsertOneResult, OptionalUnlessRequiredId} from "mongodb";

interface Prefs {
    theme: string;
    unit: "lb" | "kg";
    increment: number;
}

interface User {
    _id: string | null;
    name: string;
    password: string;
    prefs: Prefs;
}

async function login(req: Request) {
    const body = await req.json();
    const {name, password} = body;

    if (!name || !password)
        return Response.json('Must provide login name and password', {statusText: "Error", status: 422});

    let user: User | null = null;
    try {
        const data = await clientPromise;
        let dbName: string;
        let userColName: string;
        if (process.env.NEXT_PUBLIC_DB_NAME) {
            dbName = process.env.NEXT_PUBLIC_DB_NAME;
        } else throw new Error('DB name variable not set')
        if (process.env.NEXT_PUBLIC_USER_COL) {
            userColName = process.env.NEXT_PUBLIC_USER_COL;
        } else throw new Error('User Column variable not set')
        const db = data.db(dbName);
        user = await db.collection<User>(userColName).findOne({name: name}) as User;
    } catch (err) {
        console.log(err)
    }

    if (!user)
        return Response.json('Invalid Password or login name', {statusText: "Error", status: 422});

    try {
        await comparePassword(password, user?.password);
        const jwt_key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
        if (!jwt_key) {
            throw new Error("JWT secret key is not set in environment variables");
        }
        const token = jwt.sign({
            payload: {
                userId: user._id
            }
        }, jwt_key)
        saveToken(token)
        return Response.json('Success', {
            statusText: "Success",
            status: 200
        });
    } catch (e) {
        console.log(e)
        return Response.json('Invalid Password or login name', {statusText: "Error", status: 422});
    }
}

async function signup(request: Request) {
    const {name, password} = await request.json();
    try {
        const data = await clientPromise;
        const dbName = process.env.NEXT_PUBLIC_DB_NAME;
        const userColName = process.env.NEXT_PUBLIC_USER_COL;
        if (!dbName) {
            throw new Error("dbName is not set in environment variables");
        }
        if (!userColName) {
            throw new Error("userColName is not set in environment variables");
        }
        const db = data.db(dbName);
        const hashPass = await generatePassword(password) as string;
        const user: InsertOneResult<User> = await db.collection<User>(userColName).insertOne({
            name: name as string,
            password: hashPass,
            prefs: {theme: "default", unit: "lb", increment: 5}
        } as OptionalUnlessRequiredId<User>);
        const jwt_key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
        if (!jwt_key) {
            throw new Error("JWT secret key is not set in environment variables");
        }
        const token = jwt.sign({
            payload: {
                userId: user.insertedId
            }
        }, jwt_key)
        saveToken(token)
        return Response.json('Success', {
            statusText: "Success",
            status: 200
        });
    } catch (e) {
        console.log(e);
        return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
    }

}

const saveToken = (userToken: string) => {
    const cookieStore = cookies();
    const target = "token"
    if (!userToken) {
        cookieStore.delete(target);
    } else {
        cookieStore.set(target, userToken);
    }
};

async function comparePassword(candidatePassword: string, userPassword: string) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, userPassword, (err, isMatch) => {
            if (err) {
                console.log("error: ", err)
                return reject(err);
            }
            if (!isMatch) {
                console.log("no match")
                return reject(false);
            }
            resolve(true);
        })
    });
}

async function generatePassword(password: string) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err)
                    return reject(err);
                resolve(hash);
            });
        });
    });

}

export async function POST(
    request: Request,
    {params}: { params: { auth: string } }
) {
    const route = params.auth;
    switch (route) {
        case 'login':
            return await login(request);
        case 'signup':
            return await signup(request);
        default:
            return Response.json('Not found', {statusText: "Error", status: 404})
    }
}
