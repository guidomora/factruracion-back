import { Router } from "express";
import { BillingController } from "./controllers";

export class BillingRoutes {
    static get routes(): Router {
        const router = Router();
        const billingController = new BillingController();
        router.get('/', billingController.getBillings);
        router.post('/', billingController.createBilling);
        router.delete('/:id', billingController.deleteBilling);
        router.put('/:id', billingController.updateBilling);
        router.get('/search/:searchTerm', billingController.getBillbyIdOrDescription);
        router.get('/year/:year', billingController.getMonthsFromYear);
        router.get('/personId/:id/:year', billingController.getTotalFromIdPerson)
        return router;
    }
}