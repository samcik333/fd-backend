import { User } from "../entities/User"

const bcrypt = require("bcrypt")

export default async function encryptPassword(password: string) {
    return await bcrypt.hash(password, 10)
}

export const decryptPassword = async (password: string, user: User) => {
    return await bcrypt.compare(password, user.password)
}