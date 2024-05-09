import { AppDataSource } from "../dataSource"
import { Team } from "../entities/Team"
import {Like} from "typeorm";
import {TeamFilterParams} from "../api/controllers/TeamController";

export const saveTeam = async (team: Team) => {
    return await AppDataSource.getRepository(Team).save(team)
}

export const getPlayersByTeam = async (homeId: number, awayId: number) => {
    return await AppDataSource.getRepository(Team).find({
        where: [
            { teamId: homeId },
            { teamId: awayId }],
        relations: ["players"]
    })
}

export const getTeamById = async (id: number) => {
    return await AppDataSource.getRepository(Team).findOne({
        where: {
            teamId: id
        },
        relations: ["players"]
    })
}

export const getTeams = async (teamFilterParams: TeamFilterParams) => {
    return await AppDataSource.getRepository(Team).find({
        where: {
            ...(teamFilterParams.name && { name: Like(`%${teamFilterParams.name}%`) }),
        }
    })
}

export const getMyTeams = async (teamFilterParams: TeamFilterParams, ownerId: number) => {
    return await AppDataSource.getRepository(Team).find({
        where: {
            owner: { userId: ownerId },
            ...(teamFilterParams.name && { name: Like(`%${teamFilterParams.name}%`) }),
        }
    })
}

export const updateTeam = async (id: number, team: Team) => {
    return await AppDataSource.getRepository(Team).update(id, team)
}
