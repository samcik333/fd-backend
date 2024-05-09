import { FastifyReply, FastifyRequest } from "fastify"
import { Role, User } from "../../entities/User"
import { findRegisteredUser, getUserById, registerNewUser } from "../../services/userService"
import encryptPassword, { decryptPassword } from "../../utils/cryptPass"
import jwt from "jsonwebtoken"


export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const userRoles = []
    const { username, email, password, roles, firstName, secondName } = request.body as User
    console.log(username, email)
    const existingUsers = await findRegisteredUser(username, email)
    if (existingUsers.length > 0) {
        // User exists, send a 409 Conflict response
        reply.code(409).send({ message: 'User already exists.' })
        return
    }

    const encryptedPassword = await encryptPassword(password)
    userRoles.push(Role.User)
    if (roles !== undefined) {
        roles.map(role => {
            userRoles.push(role)
        })
    }

    const user = new User()
    user.username = username
    user.email = email
    user.password = encryptedPassword
    user.roles = userRoles
    user.firstName = firstName
    user.secondName = secondName

    const regUser = await registerNewUser(user)

    const token = jwt.sign(
        {
            id: regUser.userId,
        },
        "FdUser",
        {
            expiresIn: "7d",
        }
    )
    return reply.header('Set-Cookie', `access_token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=7200; Path=/`).code(200).send({ message: "Successfully registered" })
}

export const loginRegister = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, email, password } = request.body as User

    const userToLogin = await findRegisteredUser(username, email)
    if (userToLogin.length < 1) {
        return reply.status(409).send({
            message: "User does not exist",
        })
    }

    const shouldLogin = await decryptPassword(password, userToLogin[0])
    if (!shouldLogin) {
        return reply.status(400).send({
            message: "Invalid username or password",
        })
    }

    const token = jwt.sign(
        {
            id: userToLogin[0].userId,
        },
        "FdUser",
        {
            expiresIn: "7d",
        }
    )
    return reply.setCookie('access_token', token, {
        path: '/',
        domain: "localhost",                // Sets the path for the cookie
        expires: new Date(Date.now() + 720000 * 1000), // Sets the expiration time in milliseconds (7200 seconds from now)
        secure: true,                  // Ensures the cookie is sent over HTTPS only
        httpOnly: true,                // Ensures the cookie is not accessible through client-side scripts
        sameSite: true          // Cookie is sent with cross-site requests
    }).code(200).send({ message: "Successful login" })
}

export const logOut = async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.clearCookie("access_token").code(200).send({ message: "Successfully logged out" })
}

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
    return getUserById(request.body["userId"] as number)
}
