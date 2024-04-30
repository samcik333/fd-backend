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

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "user",
    password: "password",
    database: "dbname",
    synchronize: true,
    logging: false,
    entities: [User, Team, Tournament, Match, Player, MatchStat, MatchEvent, Scorer, Standing],
    migrations: [],
    subscribers: [],
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
            { user: users[1], teams: [teams[0]] },
            { user: users[2], teams: [teams[1]] },
            { user: users[3], teams: [teams[2]] },
            { user: users[4], teams: [teams[3]] },
            { user: users[5], teams: [teams[0]] },
            { user: users[6], teams: [teams[1]] },
            { user: users[7], teams: [teams[2]] },
            { user: users[8], teams: [teams[3]] },
        ])
        await playerRepository.save(players)

        const tournament = tournamentRepository.create([
            { organizer: users[0], name: "Spain Super cup", startDate: addDays(currentDate, -5), endDate: addDays(currentDate, -2), location: "Saudi Arabia", format: "Play-off", type: "2v2", stage: "Finished", numOfTeams: 4, status: "finished", visibility: "public", teams: [teams[0], teams[1], teams[2], teams[3]] },
            { organizer: users[0], name: "Spain League", startDate: addDays(currentDate, -2), endDate: addDays(currentDate, 2), location: "Saudi Arabia", format: "Group", type: "2v2", stage: "2.round", numOfTeams: 4, numOfGroups: 1, status: "ongoing", visibility: "public", teams: [teams[0], teams[1], teams[2], teams[3]] },
            { organizer: users[0], name: "Spain Champions League", startDate: addDays(currentDate, 1), endDate: addDays(currentDate, 6), location: "Saudi Arabia", format: "Group+Play-off", type: "2v2", stage: "Not started", numOfTeams: 4, numOfGroups: 2, numOfAdvanced: 2, status: "upcoming", visibility: "public", teams: [teams[0], teams[1], teams[2], teams[3]] }
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
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[1], secondTeam: teams[3], scoreFirstTeam: 5, scoreSecondTeam: 3, type: "16-final", matchStatFirstTeam: matchStats[1], matchStatSecondTeam: matchStats[3] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[0], secondTeam: teams[2], scoreFirstTeam: 2, scoreSecondTeam: 0, type: "16-final", matchStatFirstTeam: matchStats[0], matchStatSecondTeam: matchStats[2] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[1], secondTeam: teams[3], scoreFirstTeam: 5, scoreSecondTeam: 3, type: "16-final", matchStatFirstTeam: matchStats[1], matchStatSecondTeam: matchStats[3] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[0], secondTeam: teams[2], scoreFirstTeam: 2, scoreSecondTeam: 0, type: "16-final", matchStatFirstTeam: matchStats[0], matchStatSecondTeam: matchStats[2] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[1], secondTeam: teams[3], scoreFirstTeam: 5, scoreSecondTeam: 3, type: "16-final", matchStatFirstTeam: matchStats[1], matchStatSecondTeam: matchStats[3] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[0], secondTeam: teams[2], scoreFirstTeam: 2, scoreSecondTeam: 0, type: "16-final", matchStatFirstTeam: matchStats[0], matchStatSecondTeam: matchStats[2] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[1], secondTeam: teams[3], scoreFirstTeam: 5, scoreSecondTeam: 3, type: "16-final", matchStatFirstTeam: matchStats[1], matchStatSecondTeam: matchStats[3] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[0], secondTeam: teams[2], scoreFirstTeam: 2, scoreSecondTeam: 0, type: "16-final", matchStatFirstTeam: matchStats[0], matchStatSecondTeam: matchStats[2] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[1], secondTeam: teams[3], scoreFirstTeam: 5, scoreSecondTeam: 3, type: "quater-final", matchStatFirstTeam: matchStats[1], matchStatSecondTeam: matchStats[3] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[0], secondTeam: teams[2], scoreFirstTeam: 2, scoreSecondTeam: 0, type: "quater-final", matchStatFirstTeam: matchStats[0], matchStatSecondTeam: matchStats[2] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[1], secondTeam: teams[3], scoreFirstTeam: 5, scoreSecondTeam: 3, type: "quater-final", matchStatFirstTeam: matchStats[1], matchStatSecondTeam: matchStats[3] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[0], secondTeam: teams[2], scoreFirstTeam: 2, scoreSecondTeam: 0, type: "quater-final", matchStatFirstTeam: matchStats[0], matchStatSecondTeam: matchStats[2] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[1], secondTeam: teams[3], scoreFirstTeam: 5, scoreSecondTeam: 3, type: "semi-final", matchStatFirstTeam: matchStats[1], matchStatSecondTeam: matchStats[3] },
            { tournament: tournament[0], datetime: addDays(currentDate, -4), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[0], secondTeam: teams[2], scoreFirstTeam: 2, scoreSecondTeam: 0, type: "semi-final", matchStatFirstTeam: matchStats[0], matchStatSecondTeam: matchStats[2] },
            { tournament: tournament[0], datetime: addDays(currentDate, -3), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[1], secondTeam: teams[0], scoreFirstTeam: 4, scoreSecondTeam: 1, type: "final", matchStatFirstTeam: matchStats[5], matchStatSecondTeam: matchStats[4] },
            { tournament: tournament[1], datetime: addDays(currentDate, -1), location: "Al-Hail Stadium", status: "finished", firstTeam: teams[0], secondTeam: teams[1], scoreFirstTeam: 3, scoreSecondTeam: 0, type: "1.Round", matchStatFirstTeam: matchStats[0], matchStatSecondTeam: matchStats[1] },
            { tournament: tournament[1], datetime: addDays(currentDate, 0), location: "Al-Hail Stadium", status: "live", firstTeam: teams[2], secondTeam: teams[3], scoreFirstTeam: 1, scoreSecondTeam: 0, type: "1.Round", matchStatFirstTeam: matchStats[2], matchStatSecondTeam: matchStats[3] },
            { tournament: tournament[1], datetime: addDays(currentDate, 1), location: "Al-Hail Stadium", status: "upcoming", firstTeam: teams[0], secondTeam: teams[3], type: "2.Round", matchStatFirstTeam: matchStats[6], matchStatSecondTeam: matchStats[7] },
            { tournament: tournament[1], datetime: addDays(currentDate, 1), location: "Al-Hail Stadium", status: "upcoming", firstTeam: teams[1], secondTeam: teams[2], type: "2.Round", matchStatFirstTeam: matchStats[8], matchStatSecondTeam: matchStats[9] },
            { tournament: tournament[2], datetime: addDays(currentDate, 2), location: "Al-Hail Stadium", status: "upcoming", firstTeam: teams[0], secondTeam: teams[1], type: "1.Round", group: "A" },
            { tournament: tournament[2], datetime: addDays(currentDate, 2), location: "Al-Hail Stadium", status: "upcoming", firstTeam: teams[2], secondTeam: teams[3], type: "1.Round", group: "B" },
            { tournament: tournament[2], datetime: addDays(currentDate, 3), location: "Al-Hail Stadium", status: "upcoming", firstTeam: teams[0], secondTeam: teams[1], type: "2.Round", group: "A" },
            { tournament: tournament[2], datetime: addDays(currentDate, 3), location: "Al-Hail Stadium", status: "upcoming", firstTeam: teams[2], secondTeam: teams[3], type: "2.Round", group: "B" },
            { tournament: tournament[2], datetime: addDays(currentDate, 4), location: "Al-Hail Stadium", status: "upcoming", type: "semi-final" },
            { tournament: tournament[2], datetime: addDays(currentDate, 4), location: "Al-Hail Stadium", status: "upcoming", type: "semi-final" },
            { tournament: tournament[2], datetime: addDays(currentDate, 5), location: "Al-Hail Stadium", status: "upcoming", type: "final" },
        ])

        await matchRepository.save(matches)

        const matchEvents = matchEventRepository.create([
            { player: players[1], match: matches[0], time: 30, type: eventType.Goal },
            { player: players[5], match: matches[0], time: 30, type: eventType.Assist },
            { player: players[1], match: matches[0], time: 45, type: eventType.Goal },
            { player: players[5], match: matches[0], time: 45, type: eventType.Assist },
            { player: players[1], match: matches[0], time: 50, type: eventType.Goal },
            { player: players[5], match: matches[0], time: 50, type: eventType.Assist },
            { player: players[1], match: matches[0], time: 80, type: eventType.Goal },
            { player: players[5], match: matches[0], time: 80, type: eventType.Assist },
            { player: players[1], match: matches[0], time: 88, type: eventType.Goal },
            { player: players[5], match: matches[0], time: 88, type: eventType.Assist },
            { player: players[3], match: matches[0], time: 33, type: eventType.Goal },
            { player: players[7], match: matches[0], time: 33, type: eventType.Assist },
            { player: players[3], match: matches[0], time: 75, type: eventType.Goal },
            { player: players[7], match: matches[0], time: 75, type: eventType.Assist },
            { player: players[3], match: matches[0], time: 84, type: eventType.Goal },
            { player: players[7], match: matches[0], time: 84, type: eventType.Assist },
            { player: players[1], match: matches[0], time: 35, type: eventType.yellowCard },
            { player: players[7], match: matches[0], time: 92, type: eventType.yellowCard },
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
