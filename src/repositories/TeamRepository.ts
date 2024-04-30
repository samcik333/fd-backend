import { AppDataSource } from "../dataSource"
import { Team } from "../entities/Team"

export async function getPlayers(homeId: number, awayId: number) {
    return await AppDataSource.getRepository(Team).find({
        where: [
            { teamId: homeId },
            { teamId: awayId }],
        relations: ["players.user"]
    })
}