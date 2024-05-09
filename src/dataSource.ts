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
import {Group} from "./entities/Group";

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

export async function insertMockData() {
    const currentDate = new Date()

    // Helper function to add or subtract days from a date
    function addDays(date: Date, days: number) {
        const result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
    }
    await AppDataSource.initialize().then(async () => {
        // Repositories
        const userRepository = AppDataSource.getRepository(User)
        const teamRepository = AppDataSource.getRepository(Team)
        const tournamentRepository = AppDataSource.getRepository(Tournament)
        const matchRepository = AppDataSource.getRepository(Match)
        const playerRepository = AppDataSource.getRepository(Player)
        const matchStatRepository = AppDataSource.getRepository(MatchStat)
        const matchEventRepository = AppDataSource.getRepository(MatchEvent)
        const scorerRepository = AppDataSource.getRepository(Scorer)
        const standingRepository = AppDataSource.getRepository(Standing)
        const groupRepository = AppDataSource.getRepository(Group)

        const users = userRepository.create([
            { username: "admin", email: "admin@gmail.com", password: "pass", roles: [Role.Admin, Role.User, Role.Organizer], firstName: "admin", secondName: "admin" },
            { username: "user1", email: "user1@gmail.com", password: "pass", roles: [Role.User, Role.Owner, Role.Player], firstName: "User", secondName: "1" },
            { username: "user2", email: "user2@gmail.com", password: "pass", roles: [Role.User, Role.Owner, Role.Player], firstName: "User", secondName: "2" },
            { username: "user3", email: "user3@gmail.com", password: "pass", roles: [Role.User, Role.Owner, Role.Player,], firstName: "User", secondName: "3" },
            { username: "user4", email: "user4@gmail.com", password: "pass", roles: [Role.User, Role.Owner, Role.Player], firstName: "User", secondName: "4" },
            { username: "user5", email: "user5@gmail.com", password: "pass", roles: [Role.User, Role.Player], firstName: "User", secondName: "5" },
            { username: "user6", email: "user6@gmail.com", password: "pass", roles: [Role.User, Role.Player], firstName: "User", secondName: "6" },
            { username: "user7", email: "user7@gmail.com", password: "pass", roles: [Role.User, Role.Player], firstName: "User", secondName: "7" },
            { username: "user8", email: "user8@gmail.com", password: "pass", roles: [Role.User, Role.Player], firstName: "User", secondName: "8" },
            { username: "time", email: "time@gmail.com", password: "pass", roles: [Role.User, Role.TimeTracker], firstName: "Time", secondName: "Tracker" },
        ])

        await userRepository.save(users)

        const teams = teamRepository.create([
            { owner: users[1], name: "Barcelona" },
            { owner: users[2], name: "Real Madrid" },
            { owner: users[3], name: "Osasuna" },
            { owner: users[4], name: "Atl Madrid" }
        ])

        await teamRepository.save(teams)

        const players = playerRepository.create([
            {age: 25, firstName: "Jožko", lastName: "Mrkvička", number: 25, team: [teams[0]][0]},
        ])
        await playerRepository.save(players)

        const tournament = tournamentRepository.create([
        ])

        await tournamentRepository.save(tournament)

        const matchStats = matchStatRepository.create([
            { team: teams[0], totalShots: 20, shotsOnGoal: 7, saves: 3, corners: 7, offsides: 1, freeKicks: 20, fouls: 11 },
            { team: teams[1], totalShots: 22, shotsOnGoal: 10, saves: 3, corners: 8, offsides: 1, freeKicks: 21, fouls: 11, yellowCards: 1 },
            { team: teams[2], totalShots: 11, shotsOnGoal: 3, saves: 5, corners: 6, freeKicks: 12, fouls: 20, yellowCards: 3 },
            { team: teams[3], totalShots: 11, shotsOnGoal: 6, saves: 6, corners: 3, offsides: 2, freeKicks: 12, fouls: 19 },
            { team: teams[0], totalShots: 12, shotsOnGoal: 7, saves: 5, corners: 4, freeKicks: 10, fouls: 12, yellowCards: 3, redCards: 1 },
            { team: teams[1], totalShots: 18, shotsOnGoal: 9, saves: 6, corners: 3, freeKicks: 12, fouls: 10, yellowCards: 2 },
            { team: teams[0] },
            { team: teams[3] },
            { team: teams[1] },
            { team: teams[2] },
        ])

        await matchStatRepository.save(matchStats)

        const matches = matchRepository.create([
        ])

        await matchRepository.save(matches)

        const matchEvents = matchEventRepository.create([
        ])

        await matchEventRepository.save(matchEvents)

        const standings = standingRepository.create([
            { tournament: tournament[1], team: teams[0], position: 1, wins: 1, goalsFor: 3, goalDiff: 3, points: 3 },
            { tournament: tournament[1], team: teams[1], position: 4, loses: 0, goalsAgainst: 0, goalDiff: -3 },
            { tournament: tournament[1], team: teams[2] },
            { tournament: tournament[1], team: teams[3] },
            { tournament: tournament[2], team: teams[0], group: "A", position: 1 },
            { tournament: tournament[2], team: teams[1], group: "A", position: 2 },
            { tournament: tournament[2], team: teams[2], group: "B", position: 1 },
            { tournament: tournament[2], team: teams[3], group: "B", position: 2 },
        ])

        await standingRepository.save(standings)

        const scorers = scorerRepository.create([
            { tournament: tournament[0], player: players[1], goals: 5, yellowCars: 1 },
            { tournament: tournament[0], player: players[5], assists: 5 },
            { tournament: tournament[0], player: players[3], goals: 3 },
            { tournament: tournament[0], player: players[7], assists: 3, yellowCars: 1 }
        ])

        await scorerRepository.save(scorers)

        console.log('Mock data inserted successfully.')
    }).catch(error => {
        console.error("Error during Data Source initialization:", error)
    })
}
export async function dropDatabase() {
    await AppDataSource.dropDatabase()
}
