import {AppDataSource} from "../dataSource"
import {Standing} from "../entities/Standing"

export const saveStanding = async (standing: Standing) => {
    return await AppDataSource.getRepository(Standing).save(standing)
}

export const getStanding = async (teamId: number, tournamentId: number) => {
    return await AppDataSource.getRepository(Standing).findOne({
        where: {
            team: {teamId}, tournament: {tournamentId}
        },
        relations: ["team", "tournament"]
    })
}
