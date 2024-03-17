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
exports.BillingController = void 0;
const billModel_1 = require("../../dataSource/models/billModel");
class BillingController {
    constructor() {
        this.getBillings = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const billsFromDb = yield billModel_1.Bill.find();
            const sortedBillings = billsFromDb.sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-'));
                const dateB = new Date(b.date.split('/').reverse().join('-'));
                return dateB.getTime() - dateA.getTime();
            });
            res.json(sortedBillings);
        });
        this.createBilling = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, date, price, paid, description } = req.body;
            if (!id)
                return res.status(400).json({ message: 'id is required' });
            if (!date)
                return res.status(400).json({ message: 'date is required' });
            if (!price)
                return res.status(400).json({ message: 'price is required' });
            if (!paid)
                return res.status(400).json({ message: 'paid is required' });
            if (!description)
                return res.status(400).json({ message: 'description is required' });
            const newBilling2 = yield billModel_1.Bill.create({
                id: id.toUpperCase(),
                date,
                price,
                paid,
                description
            });
            yield newBilling2.save();
            res.json({ message: 'Billing created successfully' });
        });
        this.deleteBilling = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const bills = yield billModel_1.Bill.findOne({ id });
            if (!bills)
                return res.status(404).json({ message: 'Billing not found' });
            yield billModel_1.Bill.deleteOne({ id });
            return res.json({ message: 'Billing deleted successfully', bill: bills });
        });
        this.updateBilling = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { date, price, paid, description } = req.body;
            try {
                const bill = yield billModel_1.Bill.findOne({ id });
                if (!bill) {
                    return res.status(404).json({ message: 'Billing not found' });
                }
                const updateFields = {};
                // actualiza los campos, si no viene nada, se queda con el valor original
                updateFields.date = date || bill.date;
                updateFields.price = price || bill.price;
                updateFields.paid = paid || bill.paid;
                updateFields.description = description || bill.description;
                // Utiliza $set para realizar actualizaciones parciales
                yield billModel_1.Bill.updateOne({ id }, { $set: updateFields });
                return res.json({ message: 'Billing updated successfully', bill });
            }
            catch (error) {
                console.error('Error updating billing:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.getBillbyIdOrDescription = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { searchTerm } = req.params;
            try {
                const isNumber = !isNaN(parseFloat(searchTerm));
                const queryArray = [];
                if (isNumber) {
                    queryArray.push({ id: searchTerm });
                }
                else {
                    queryArray.push({ id: { $regex: searchTerm } });
                }
                queryArray.push({ description: { $regex: searchTerm } });
                // Agrega esto solo si price es un campo numérico
                if (isNumber) {
                    queryArray.push({ price: parseFloat(searchTerm) });
                }
                const query = { $or: queryArray };
                const bills = yield billModel_1.Bill.find(query);
                if (bills) {
                    res.json(bills);
                }
                else {
                    res.status(404).json({ error: 'Facturas no encontradas' });
                }
            }
            catch (error) {
                console.error('Error updating billing:', error);
            }
        });
        this.getMonthsFromYear = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { year } = req.params;
            const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
            try {
                const bills = yield billModel_1.Bill.find({ date: { $regex: year } });
                // Inicializar un array para almacenar los totales de cada mes, con una longitud de 12 y todos los valores en 0
                const monthlyTotals = Array.from({ length: 12 }, () => 0);
                // Calcular los totales para cada mes
                bills.forEach(bill => {
                    // el 10 especifica que se debe utilizar el sistema numérico decimal
                    const month = parseInt(bill.date.split('/')[1], 10) - 1; // el -1 es para que el mes 1 sea el índice 0
                    const plainBill = bill.toObject();
                    monthlyTotals[month] += plainBill.price;
                });
                // Convertir el array de totales mensuales a un array de objetos
                const result = months.map((month, index) => ({
                    month,
                    total: monthlyTotals[index],
                }));
                res.json(result);
            }
            catch (error) {
                console.error('Error getting months:', error);
                return res.status(500).json({ error });
            }
        });
        this.getTotalFromIdPerson = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const idFilter = yield billModel_1.Bill.find({ id: 'G' });
                res.json(idFilter);
            }
            catch (error) {
            }
        });
    }
}
exports.BillingController = BillingController;
