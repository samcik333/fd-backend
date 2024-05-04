import { FastifyRequest, FastifyReply } from "fastify"
import jwt from "jsonwebtoken"

interface MyToken {
    id: string
    username: string
    iat: number
    exp: number
};

export async function authorization(request, reply) {
    const token = request.cookies.access_token
    console.log("auth", request.cookies)

    if (!token) {
        reply.code(403).send({ message: "No token provided" })
        return reply
    }

    try {
        const data = jwt.verify(token, "FdUser") as MyToken
        request.body = { ...request.body, userId: data.id } // Add the id to the body
        return
    } catch (error) {
        reply.code(403).send({ message: "Token error" })
        return reply
    }
}
