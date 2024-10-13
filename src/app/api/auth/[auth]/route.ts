import clientPromise from "@/lib/mongodb";

const jwt = require('jsonwebtoken');

const jwtString = process.env.JWT_AUTH;

async function login(req:Request) {
    const {name, password} = req.body;

    if (!name || !password)
        return Response.json('Must provide login name and password', {statusText: "Error", status: 422});

    let user;
    try {
        const data = await clientPromise;
        const db = data.db(process.env.DB_NAME);
        user = await db.collection(process.env.USER_COL).findOne({name});
    } catch (err) {
        console.log(err)
    }

    if (!user)
        return Response.json('Invalid Password or login name', {statusText: "Error", status: 422});

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
        return Response.json('Invalid Password or login name', {statusText: "Error", status: 422});
    }
}

async function signup(request: Request) {
    const {name, password} = request.body;
        try {
            const data = await clientPromise;
            const db = data.db(process.env.DB_NAME);
            const user = await db.collection(process.env.USER_COL).insert({name:name,password:password});
            const token = jwt.sign({
            payload: {
                userId: user._id
            },
            secret: jwtString
        });
            Response.json({token},{statusText:"success",status:200});
        } catch (e) {
            console.log(e);
            Response.json('Unexpected error occurred.', {statusText: "Error", status: 422});
        }

}

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const route = params.slug;
    switch (route){
        case "login": return await login(request);
        case "signup": return await login(request);
        default: return Response.json('Not found', {statusText: "Error", status: 404})
    }
}
