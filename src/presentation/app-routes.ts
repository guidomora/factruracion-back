import { Router } from "express";
import { BillingRoutes } from "./billing/routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/billing', BillingRoutes.routes);

        return router;
    }
}