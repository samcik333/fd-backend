import {AppDataSource} from "../dataSource";
import {Group} from "../entities/Group";

export const saveGroup = async (group: Group) => {
    return await AppDataSource.getRepository(Group).save(group)
}

export const insertGroup = async (group: Group) => {
    return await AppDataSource.getRepository(Group).insert(group)
}

export const updateGroup = async (group: Group) => {
    return await AppDataSource.getRepository(Group).update(group.groupId, group)
}

export const getGroupById = async (id: number) => {
    return await AppDataSource.getRepository(Group).findOne({
        where: {
            groupId: id
        },
        relations: ["teams", "matches", "tournament", "homeTeam", "awayTeam"]
    })
}
