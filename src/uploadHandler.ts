import {mkdirSync, realpathSync} from "fs";
import {existsSync} from "node:fs";
import {MultipartFile} from "@fastify/multipart";
import {writeFile} from "node:fs/promises";
import {FastifyReply} from "fastify";

export const uploadsDir = realpathSync("uploads")
const tournamentsDir = uploadsDir + "/tournaments"
const teamsDir = uploadsDir + "/teams"

export const initializeUploadsDir = () => {
    if (!uploadsDir) {
        throw new Error("Uploads directory not found")
    }
    if (!existsSync(tournamentsDir)) {
        mkdirSync(tournamentsDir)
    }
    if (!existsSync(teamsDir)) {
        mkdirSync(teamsDir)
    }
}

export const uploadTeamLogo = async (file: MultipartFile, teamName: string) => {
    const extension = file.filename.split('.')

    if (extension.length < 2) {
        throw new Error('Invalid file extension')
    }
    const filename = `${Date.now()}-${teamName}.${extension.pop()}`
    const filePath = `${teamsDir}/${filename}`

    try {
        const buffer = await file.toBuffer()
        await writeFile(filePath, buffer)
    } catch (error) {
        console.error('Error during file upload:', error)
        throw new Error('Error during file upload')
    }

    return `uploads/teams/${filename}`
}

export const uploadTournamentLogo = async (file: MultipartFile, tournamentName: string) => {
    const extension = file.filename.split('.')
    if (extension.length < 2) {
        throw new Error('Invalid file extension')
    }
    const filename = `${Date.now()}-${tournamentName}.${extension.pop()}`
    const filePath = `${tournamentsDir}/${filename}`

    try {
        const buffer = await file.toBuffer()
        await writeFile(filePath, buffer)
    } catch (error) {
        throw new Error('Error during file upload')
    }

    return `uploads/tournaments/${filename}`
}
