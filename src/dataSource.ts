import "reflect-metadata"
import { DataSource } from "typeorm"
import { Role, User } from './entities/User'
import { Team } from './entities/Team'
import { Tournament } from './entities/Tournament'
import { Match } from './entities/Match'
import { Player } from './entities/Player'
import { MatchStat } from './entities/MatchStat'
import { MatchEvent } from './entities/MatchEvent'
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
    await AppDataSource.initialize().then(async () => {
        // DataSource is initialized and we can insert data

        const users = AppDataSource.getRepository(User).create([
            { username: 'user1', email: 'user1@example.com', password: 'pass1', roles: [Role.Player, Role.Owner], logo: 'logo1.png', firstName: "Janko", secondName: "Mrkva" },
            { username: 'user2', email: 'user2@example.com', password: 'pass2', roles: [Role.Player, Role.Owner], logo: 'logo2.png', firstName: "Janko", secondName: "Mrkva" },
            { username: 'user3', email: 'user3@example.com', password: 'pass3', roles: [Role.Player], logo: 'logo3.png', firstName: "Janko", secondName: "Mrkva" },
            { username: 'user4', email: 'user4@example.com', password: 'pass4', roles: [Role.Organizer], logo: 'logo4.png', firstName: "Janko", secondName: "Mrkva" }
        ])
        await AppDataSource.getRepository(User).save(users)

        const players = AppDataSource.getRepository(Player).create([
            { user: users[0] },
            { user: users[1] },
            { user: users[2] },
            { user: users[3] }
        ])
        await AppDataSource.getRepository(Player).save(players)

        // Teams
        const teams = AppDataSource.getRepository(Team).create([
            { name: 'Team A', owner: users[0], logo: 'teamA.png', players: [players[0], players[1]] },
            { name: 'Team B', owner: users[1], logo: 'teamB.png', players: [players[2], players[3]] }
        ])
        await AppDataSource.getRepository(Team).save(teams)

        // Tournament
        const tournament = AppDataSource.getRepository(Tournament).create({
            name: 'Tournament 1',
            organizer: users[3],
            startDate: new Date(),
            endDate: new Date(),
            type: 'League',
            format: '2v2',
            numOfTeams: 2,
            teams: teams,
            status: 'upcoming'
        })
        await AppDataSource.getRepository(Tournament).save(tournament)

        const matchStat = AppDataSource.getRepository(MatchStat).create({
            team: teams[0],
            totalShots: 10,
            shotsOnGoal: 5,
            saves: 3,
            corners: 4,
            offsides: 2,
            redCards: 1,
            yellowCards: 2
        })
        await AppDataSource.getRepository(MatchStat).save(matchStat)

        const matchStat2 = AppDataSource.getRepository(MatchStat).create({
            team: teams[1],
            totalShots: 10,
            shotsOnGoal: 5,
            saves: 3,
            corners: 4,
            offsides: 2,
            redCards: 1,
            yellowCards: 2
        })
        await AppDataSource.getRepository(MatchStat).save(matchStat2)

        // Match
        const match = AppDataSource.getRepository(Match).create({
            tournament: tournament,
            datetime: new Date(),
            location: 'Location 1',
            firstTeam: teams[0],
            secondTeam: teams[1],
            status: 'upcoming',
            type: 'League',
            matchStatFirstTeam: matchStat,
            matchStatSecondTeam: matchStat2
        })
        await AppDataSource.getRepository(Match).save(match)

        // Players

        // MatchStat


        // MatchEvent
        const matchEvent = AppDataSource.getRepository(MatchEvent).create({
            match: match,
            player: players[0],
            time: new Date(),
            type: 'goal'
        })
        await AppDataSource.getRepository(MatchEvent).save(matchEvent)

        // Scorers
        const scorers = AppDataSource.getRepository(Scorer).create([
            { tournament: tournament, player: players[0], goals: 2, assists: 1 },
            { tournament: tournament, player: players[1], goals: 1, assists: 2 },
            { tournament: tournament, player: players[2], goals: 3, assists: 0 }
        ])
        await AppDataSource.getRepository(Scorer).save(scorers)

        const standings = AppDataSource.getRepository(Standing).create(
            {
                tournamentId: tournament, // Assuming 'tournament' is a Tournament entity instance
                team: teams[0], // Assuming 'teams' is an array of Team entity instances
                position: 1,
                wins: 0,
                draws: 0,
                loses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDiff: 0,
                points: 0,
                group: "A"
            }
            // Additional standings can be added here
        )

        await AppDataSource.getRepository(Standing).save(standings)

        console.log('Mock data inserted successfully.')
    }).catch(error => console.log("Error during Data Source initialization:", error))
}
