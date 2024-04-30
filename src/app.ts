import Fastify from 'fastify'
import "reflect-metadata"
import routeRegistrations from './api/routes'
import { AppDataSource, dropDatabase, insertMockData } from './dataSource'
import cors from '@fastify/cors'

const server = Fastify({ logger: true })




const start = async () => {
    try {
        await AppDataSource.initialize()
        await server.register(cors, {
            origin: '*', // WARNING: '*' means "allow all" and is not safe for production.
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        })
        await server.register(routeRegistrations)
        await server.listen({ port: 3000, host: '0.0.0.0' })
        //insertMockData()
        //dropDatabase()
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }


}

start()