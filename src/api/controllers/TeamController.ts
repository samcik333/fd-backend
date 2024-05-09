import {FastifyReply, FastifyRequest} from "fastify"
import {saveTeam, getPlayersByTeam, getTeams, getTeamById, getMyTeams} from "../../services/TeamService"
import {Team} from "../../entities/Team";
import {getUser} from "../../services/userService";
import {uploadTeamLogo} from "../../uploadHandler";
import {MultipartFields, MultipartFile} from "@fastify/multipart";

interface TeamParams {
    homeId: number
    awayId: number
}

export const addTeam = async (request: FastifyRequest, reply: FastifyReply) => {
    interface TeamSaveProps {
        name: {
            value: string
            fields: MultipartFields
        };
    }

    const { name} = request.body as TeamSaveProps
    const logo = name.fields["image"] as MultipartFile
    const owner = await getUser(request.body["userId"])
    if (!owner) {
        return reply.code(404).send({ error: 'User not found' })
    }

    const team = new Team()
    team.name = name.value as string
    team.owner = owner
    if (logo) {
        try {
            team.logo = await uploadTeamLogo(logo, name.value as string)
        } catch (error) {
            console.error('Error during file upload:', error)
            return reply.code(500).send({ error: 'Error during file upload' })
        }
    }
    return await saveTeam(team)
}

export const getTeam = async (request: FastifyRequest) => {
    interface GetTeamParams {
        id: number
    }
    const { id } = request.params as GetTeamParams
    return await getTeamById(id)
}

export interface TeamFilterParams {
    name: string
}

export const getAllTeams = async (request: FastifyRequest) => {
    const teamFilterParams = request.query as TeamFilterParams
    return await getTeams(teamFilterParams)
}

export const listMyTeams = async (request: FastifyRequest) => {
    const teamFilterParams = request.query as TeamFilterParams
    return await getMyTeams(teamFilterParams, request.body["userId"] as number)
}

export const getTeamsPlayers = async (request: FastifyRequest) => {
    const { homeId, awayId } = request.params as TeamParams
    return await getPlayersByTeam(homeId, awayId)
}
