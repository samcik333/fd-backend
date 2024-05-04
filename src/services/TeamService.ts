import { AppDataSource } from "../dataSource"
import { Team } from "../entities/Team"

export const getPlayersByTeam = async (homeId: number, awayId: number) => {
    return await AppDataSource.getRepository(Team).find({
        where: [
            { teamId: homeId },
            { teamId: awayId }],
        relations: ["players.user"]
    })
}