import { Request, Response } from "express";
import { Bill } from '../../dataSource/models/billModel';
import { PaginationDto } from "../../Dtos/pagination";
import { BillService } from "../service/billService";


export interface Billing {
    id: string;
    date: string;
    price: number;
    paid: string;
    description: string;
}

export class BillingController {
    constructor(
        private readonly billService: BillService
    ) { }

    public getBillings = async (req: Request, res: Response) => {
        // const billsFromDb = await Bill.find()
        // const sortedBillings = billsFromDb.sort((a, b) => { // Ordena las facturas por fecha de forma descendente
        //     const dateA = new Date(a.date.split('/').reverse().join('-')); // Convierte la fecha a un objeto Date
        //     const dateB = new Date(b.date.split('/').reverse().join('-'));

        //     return dateB.getTime() - dateA.getTime(); // Compara las fechas y devuelve el resultado
        // });

        // res.json(sortedBillings);
        const {page = '1', limit = '10'} = req.query
        try {
            const bills = await this.billService.getBillingsByPagination(parseInt(page as string), parseInt(limit as string))
            res.status(200).json(bills)
        } catch (error) {
            res.status(500).json({ message: error });
        }
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

    public getTotalFromIdPerson = async (req: Request, res: Response) => {
        const { id, year } = req.params;
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        
        try {
            // Buscar todas las facturas que coincidan con el id y el año
            const idFilter = await Bill.find({id:{$regex:id}, date:{ $regex: year }})
            const monthlyTotals = Array.from({ length: 12 }, () => 0);
            idFilter.forEach(bill => {
                // el 10 especifica que se debe utilizar el sistema numérico decimal
                const month = parseInt(bill.date.split('/')[1], 10) - 1; // el -1 es para que el mes 1 sea el índice 0
                const plainBill = bill.toObject();
                monthlyTotals[month] += plainBill.price;
            });
            const result = months.map((month, index) => ({
                month,
                total: monthlyTotals[index],
            }));
            res.json(result) 
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    public getBillsByPerson = async (req:Request, res:Response) => {
        const {personLetter} = req.params
        const {personDate} = req.query
        try {
            const bills = await Bill.find({id:{$regex:personLetter.toUpperCase() }})
            const perMonth = bills.filter(bill => bill.date.slice(3) == personDate)
            
            return res.status(200).json(perMonth)
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    public getUnpaidData = async (req:Request, res:Response) => {
        try {
            const unpaid = await this.billService.unpaidData()
            return res.status(200).json(unpaid)
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
}

