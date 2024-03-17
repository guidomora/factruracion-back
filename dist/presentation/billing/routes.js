"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("./controllers");
class BillingRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const billingController = new controllers_1.BillingController();
        router.get('/', billingController.getBillings);
        router.post('/', billingController.createBilling);
        router.delete('/:id', billingController.deleteBilling);
        router.put('/:id', billingController.updateBilling);
        router.get('/search/:searchTerm', billingController.getBillbyIdOrDescription);
        router.get('/year/:year', billingController.getMonthsFromYear);
        return router;
    }
}
exports.BillingRoutes = BillingRoutes;
