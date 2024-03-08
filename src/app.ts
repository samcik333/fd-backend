import fastify from 'fastify';
import "reflect-metadata";

const server = fastify({logger: true});

const start = async () => {
    try {
        await server.listen({port: 3000, host: '0.0.0.0'});
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }


};

start();