import {AppDataSource} from "../dataSource";
import {Player} from "../entities/Player";

export const getPlayer = async (playerId: number) => {
    return await AppDataSource.getRepository(Player).findOne({
        where: {
            playerId: playerId
        },
        relations: ["team"]
    })
}

export const savePlayer = async (player: Player) => {
    return await AppDataSource.getRepository(Player).save(player)
}
