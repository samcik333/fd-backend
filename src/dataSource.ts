import "reflect-metadata"
import { DataSource } from "typeorm"
import { Role, User } from './entities/User'
import { Team } from './entities/Team'
import { Tournament } from './entities/Tournament'
import { Match } from './entities/Match'
import { Player } from './entities/Player'
import { MatchStat } from './entities/MatchStat'
import { eventType, MatchEvent } from './entities/MatchEvent'
import { Scorer } from './entities/Scorer'
import { Standing } from './entities/Standing'
import { Group } from "./entities/Group"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "user",
    password: "password",
    database: "dbname",
    synchronize: true,
    logging: true,
    entities: [User, Team, Tournament, Match, Player, Group, MatchStat, MatchEvent, Scorer, Standing],
    migrations: [],
    subscribers: [],
    logger: "advanced-console"
})
export async function dropDatabase() {
    await AppDataSource.dropDatabase()
}
