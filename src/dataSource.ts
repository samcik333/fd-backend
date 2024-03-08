import "reflect-metadata"
import {DataSource} from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "user",
    password: "password",
    database: "dbname",
    synchronize: true,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
})