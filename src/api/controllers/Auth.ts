import { FastifyReply, FastifyRequest } from "fastify"
import { Role, User } from "../../entities/User"
import { findRegisteredUser, registerNewUser } from "../../services/userService"
import encryptPassword from "../../utils/cryptPass"
import jwt from "jsonwebtoken"


export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, email, password, roles, firstName, secondName } = request.body as User
    const existingUsers = await findRegisteredUser(username, email)
    if (existingUsers.length > 0) {
        // User exists, send a 409 Conflict response
        reply.code(409).send({ message: 'User already exists.' })
        return
    }

    const encryptedPassword = await encryptPassword(password)
    roles.push(Role.User)

    const user = new User()
    user.username = username
    user.email = email
    user.password = encryptedPassword
    user.roles = roles
    user.firstName = firstName
    user.secondName = secondName

    const regUser = await registerNewUser(user)

    const token = jwt.sign(
        {
            id: user.userId,
        },
        "SlUser",
        {
            expiresIn: "2h",
        }
    )

}