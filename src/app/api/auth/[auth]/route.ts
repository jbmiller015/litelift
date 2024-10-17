import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import {cookies} from 'next/headers'


async function login(req: Request) {
    const body = await req.json();
    const {email, password} = body;

    if (!email || !password)
        return Response.json('Must provide login name and password', {statusText: "Error", status: 422});

    let user;
    try {
        const data = await clientPromise;
        const db = data.db(process.env.DB_NAME);
        user = await db.collection(process.env.USER_COL).findOne({name: email});
        console.log(user)
    } catch (err) {
        console.log(err)
    }

    if (!user)
        return Response.json('Invalid Password or login name', {statusText: "Error", status: 422});

    try {
        await comparePassword(password, user.password);
        const jwt_key = process.env.JWT_SECRET_KEY;
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
    const {name, password} = request.json();
    try {
        const data = await clientPromise;
        const db = data.db(process.env.DB_NAME);
        const hashPass = await generatePassword(password);
        const user = await db.collection(process.env.USER_COL).insert({name: name, password: hashPass});
        const jwt_key = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({
            userId: user._id
        }, jwt_key)
        return Response.json({token}, {statusText: "success", status: 200});
    } catch (e) {
        console.log(e);
        return Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
    }

}

const saveToken = userToken => {
    const cookieStore = cookies();
    if (!userToken) {
        cookieStore.delete('token');
    } else {
        cookieStore.set('token', userToken);
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
            bcrypt.hash(password, 10, (err, hash) => {
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
            return await login(request);
        default:
            return Response.json('Not found', {statusText: "Error", status: 404})
    }
}
