import clientPromise from "@/lib/mongodb";

const jwt = require('jsonwebtoken');

const jwtString = process.env.JWT_AUTH;

export async function POST(req: Request) {
    const {email, password} = req.body;

    if (!email || !password)
        return Response.json('Must provide email and password', {statusText: "Error", status: 422});

    let user;
    try {
        const data = await clientPromise;
        const db = data.db(process.env.DB_NAME);
        user = await db.collection(process.env.USER_COL).findOne({email});
    } catch (err) {
        console.log(err)
    }

    if (!user)
        return Response.json('Invalid Password or email', {statusText: "Error", status: 422});

    try {
        await user.comparePassword(password);
        const token = jwt.sign({
            payload: {
                userId: user._id
            },
            secret: jwtString
        })
        Response.json({token}, {statusText: "Success", status: 200});
    } catch (e) {
        return Response.json('Invalid Password or email', {statusText: "Error", status: 422});
    }
}
