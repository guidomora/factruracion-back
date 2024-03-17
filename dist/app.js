"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const envs_1 = require("./config/envs");
const dbConnection_1 = require("./dataSource/dbConnection");
const app_routes_1 = require("./presentation/app-routes");
const server_1 = require("./presentation/server");
(() => {
    main();
})();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Hello World');
        yield (0, dbConnection_1.dbConnection)();
        const server = new server_1.Server({
            port: envs_1.envs.PORT,
            public_path: envs_1.envs.PUBLIC_PATH,
            routes: app_routes_1.AppRoutes.routes
        });
        server.start();
    });
}
