import { FastifyReply, FastifyRequest } from "fastify"
import { Role, User } from "../../entities/User"
import { findRegisteredUser, registerNewUser } from "../../services/userService"
import encryptPassword from "../../utils/cryptPass"
import jwt from "jsonwebtoken"


export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const userRoles = []
    const { username, email, password, roles, firstName, secondName } = request.body as User
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
            expiresIn: "2h",
        }
    )
    return reply.header('Set-Cookie', `access_token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=7200; Path=/`).code(200).send({ message: "Successfully registered" })
}

// export const loginRegister = async (request: FastifyRequest, reply: FastifyReply) => {
//     const { username, email, password } = request.body as User

    

//     const token = jwt.sign(
//         {
//             id: regUser.userId,
//         },
//         "FdUser",
//         {
//             expiresIn: "2h",
//         }
//     )
//     return reply.header('Set-Cookie', `access_token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=7200; Path=/`).code(200).send({ message: "Successfully registered" })
// }