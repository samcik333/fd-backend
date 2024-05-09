import Fastify from 'fastify'
import "reflect-metadata"
import routeRegistrations from './api/routes'
import { AppDataSource, dropDatabase, insertMockData } from './dataSource'
import cors from '@fastify/cors'
import cookie from "@fastify/cookie"
import {initializeUploadsDir, uploadsDir} from "./uploadHandler";
import multipart from '@fastify/multipart'
import staticPlugin from '@fastify/static'

const server = Fastify({ logger: true })

const start = async () => {
    try {
        initializeUploadsDir()
        await AppDataSource.initialize()
        server.decorateRequest('user', null)
        await server.register(multipart, {
            attachFieldsToBody: true,
            limits: {
                fileSize: 20 * 1024 * 1024, // 20MB
            },
        })
        await server.register(staticPlugin, {
            root: uploadsDir,
            prefix: '/uploads/',
        });
        await server.register(cors, {
            origin: 'http://localhost:3001', // WARNING: '*' means "allow all" and is not safe for production.
            methods: ['GET', 'POST', 'PUT', 'DELETE', "OPTIONS"],
            credentials: true
        })
        await server.register(cookie, {
            secret: "my-secret", // for cookies signature
            hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
            parseOptions: {}  // options for parsing cookies
        })
        await server.register(routeRegistrations)
        await server.listen({ port: 3000, host: '0.0.0.0' })
        // insertMockData()
        // dropDatabase()
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
