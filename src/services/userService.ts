import { User } from "../entities/User"
import { getUser, saveUser } from "../repositories/UserRepository"

export const findRegisteredUser = async (username: string, email: string) => {
    return await getUser(username, email)
}

export const registerNewUser = async (user: User) => {
    return await saveUser(user)
}