import { envs } from "../config/envs"
import { connect } from "./mongoDB/init"


export const dbConnection = async () => {
    await connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    })
}