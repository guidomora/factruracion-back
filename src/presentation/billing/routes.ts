import { Router } from "express";
import { BillingController } from "./controllers";
import { BillService } from "../service/billService";

export class BillingRoutes {
    static get routes(): Router {
        const router = Router();
        const billingService = new BillService();
        const billingController = new BillingController(billingService);
        router.get('/', billingController.getBillings);
        router.post('/', billingController.createBilling);
        router.delete('/:id', billingController.deleteBilling);
        router.put('/:id', billingController.updateBilling);
        router.get('/search/:searchTerm', billingController.getBillbyIdOrDescription);
        router.get('/year/:year', billingController.getMonthsFromYear);
        router.get('/personId/:id/:year', billingController.getTotalFromIdPerson)
        router.get('/byPerson/:personLetter', billingController.getBillsByPerson)
        router.get('/unpaid', billingController.getUnpaidData)
        return router;
    }
}