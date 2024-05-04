import { AppDataSource } from "../dataSource"
import { User } from "../entities/User"

export const findRegisteredUser = async (username: string, email: string) => {
    return await AppDataSource.getRepository(User).find({
        where: [
            { username: username },
            { email: email }
        ]
    })
}

export const registerNewUser = async (user: User) => {
    return await AppDataSource.getRepository(User).save(user)
}

export const getUserById = async (userId: number) => {

    return await AppDataSource.getRepository(User).find({
        where: { userId: userId },
        select: { username: true, email: true, firstName: true, secondName: true, userId: true }
    })
}

export const getUser = async (userId: string) => {

    return await AppDataSource.getRepository(User).findOneBy({ userId: parseInt(userId) })
}
