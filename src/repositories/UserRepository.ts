import { AppDataSource } from "../dataSource"
import { User } from "../entities/User"

export const getUser = async (username: string, email: string) => {

    return await AppDataSource.getRepository(User).find({
        where: [
            { username: username },
            { email: email }
        ]
    })
}

export const saveUser = async (user: User) => {
    return await AppDataSource.getRepository(User).save(user)
}