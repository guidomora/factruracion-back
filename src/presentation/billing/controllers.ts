import { Request, Response } from "express";
import { Bill } from '../../dataSource/models/billModel';


interface Billing {
    id: string;
    date: string;
    price: number;
    paid: string;
    description: string;
}

export class BillingController {
    constructor() { }

    public getBillings = async (req: Request, res: Response) => {
        const billsFromDb = await Bill.find()
        const sortedBillings = billsFromDb.sort((a, b) => {
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));

            return dateB.getTime() - dateA.getTime();
        });

        res.json(sortedBillings);
    }

    public createBilling = async (req: Request, res: Response) => {
        const { id, date, price, paid, description } = req.body;
        if (!id) return res.status(400).json({ message: 'id is required' });
        if (!date) return res.status(400).json({ message: 'date is required' });
        if (!price) return res.status(400).json({ message: 'price is required' });
        if (!paid) return res.status(400).json({ message: 'paid is required' });
        if (!description) return res.status(400).json({ message: 'description is required' });
        const newBilling2 = await Bill.create({
            id: id.toUpperCase(),
            date,
            price,
            paid,
            description
        })
        await newBilling2.save();
        res.json({ message: 'Billing created successfully' });
    }

    public deleteBilling = async (req: Request, res: Response) => {
        const { id } = req.params;
        const bills = await Bill.findOne({ id })
        if (!bills) return res.status(404).json({ message: 'Billing not found' });
        await Bill.deleteOne({ id })
        return res.json({ message: 'Billing deleted successfully', bill: bills });
    }

    public updateBilling = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { date, price, paid, description } = req.body;
        try {
            const bill = await Bill.findOne({ id });

            if (!bill) {
                return res.status(404).json({ message: 'Billing not found' });
            }

            const updateFields: { [key: string]: Billing } = {};

            // actualiza los campos, si no viene nada, se queda con el valor original
            updateFields.date = date || bill.date;
            updateFields.price = price || bill.price;
            updateFields.paid = paid || bill.paid;
            updateFields.description = description || bill.description;

            // Utiliza $set para realizar actualizaciones parciales
            await Bill.updateOne({ id }, { $set: updateFields });

            return res.json({ message: 'Billing updated successfully', bill });
        } catch (error) {
            console.error('Error updating billing:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public getBillbyIdOrDescription = async (req: Request, res: Response) => {
        const { searchTerm } = req.params;

        try {
            const isNumber = !isNaN(parseFloat(searchTerm));

            const queryArray = [];

            if (isNumber) {
                queryArray.push({ id: searchTerm });
            } else {
                queryArray.push({ id: { $regex: searchTerm } });
            }

            queryArray.push({ description: { $regex: searchTerm } });

            // Agrega esto solo si price es un campo numérico
            if (isNumber) {
                queryArray.push({ price: parseFloat(searchTerm) });
            }

            const query = { $or: queryArray };

            const bills = await Bill.find(query);

            if (bills) {
                res.json(bills);
            } else {
                res.status(404).json({ error: 'Facturas no encontradas' });
            }
        } catch (error) {
            console.error('Error updating billing:', error);
        }

    }


    public getMonthsFromYear = async (req: Request, res: Response) => {
        const { year } = req.params;
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        try {
            const bills = await Bill.find({ date: { $regex: year } });

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

        } catch (error) {
            console.error('Error getting months:', error);
            return res.status(500).json({ error });
        }

    }
}