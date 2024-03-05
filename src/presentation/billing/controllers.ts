import { Request, Response } from "express";
import { Bill } from '../../dataSource/models/billModel';

const billings = [
    {
        id: "123G",
        date: '21/02/2024',
        price: 250000,
        paid: true,
        description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        id: "123H",
        date: '28/02/2024',
        price: 150000,
        paid: true,
        description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        id: "123I",
        date: '25/02/2024',
        price: 50000,
        paid: false,
        description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
]

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
            id,
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

        console.log(searchTerm);


        try {

            // const bills = await Bill.find({
            //     $or: [
            //         // { id: new RegExp(searchTerm, 'i')  },
            //         // { description: new RegExp(searchTerm, 'i') },
            //         // { price: searchTerm },
            //         {id: {$regex: searchTerm}},
            //         {description: {$regex: searchTerm}},
            //         // {price: {$regex: searchTerm}},
            //     ] 
            // })
            const isNumber = !isNaN(parseFloat(searchTerm));

            const queryArray = [];
    
            if (isNumber) {
                queryArray.push({ id: searchTerm });
            } else {
                queryArray.push({ id: { $regex: searchTerm} });
            }
    
            queryArray.push({ description: { $regex: searchTerm} });
    
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
}