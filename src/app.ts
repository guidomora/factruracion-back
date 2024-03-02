import { envs } from "./config/envs";
import { dbConnection } from "./dataSource/dbConnection";
import { AppRoutes } from "./presentation/app-routes";
import { Server } from "./presentation/server";

(()=>{
    main()
})()

async function main () {
    console.log('Hello World');
    await dbConnection()
    const server = new Server({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
        routes: AppRoutes.routes
        
    })

    server.start()
}