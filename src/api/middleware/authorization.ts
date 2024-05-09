import {FastifyRequest, FastifyReply, HookHandlerDoneFunction} from "fastify"
import jwt from "jsonwebtoken"

interface MyToken {
    id: string
    username: string
    iat: number
    exp: number
}

export async function authorization(request, reply, done) {
    const token = request.cookies.access_token
    console.log("auth", request.cookies)

    if (!token) {
        console.log("No token provided")
        return reply.code(403).send({ message: "No token provided" })
    }

    try {
        const data = jwt.verify(token, "FdUser") as MyToken
        request.body = { ...request.body, userId: data.id } // Add the id to the body
    } catch (error) {
        console.error("Token error:", error)
        return reply.code(403).send({ message: "Token error" })
    }
}
