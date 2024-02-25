import { Request, Response } from "express";

const billings = [
    {
        id:"123G",
        date: new Date(),
        price: 250000,
        paid: true,
        description:'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        id:"123H",
        date: new Date(),
        price: 150000,
        paid: true,
        description:'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        id:"123I",
        date: new Date(),
        price: 50000,
        paid: false,
        description:'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
]

export class BillingController {
    constructor(){}

    public getBillings = async (req:Request, res:Response) => {
         res.json(billings);
    }

    public createBilling = async (req:Request, res:Response) => {
        const {id, date, price, paid, description} = req.body;
        if (!id) return res.status(400).json({message: 'id is required'});
        if (!date) return res.status(400).json({message: 'date is required'});
        if (!price) return res.status(400).json({message: 'price is required'});
        if (!paid) return res.status(400).json({message: 'paid is required'});
        if (!description) return res.status(400).json({message: 'description is required'});
        const newBilling = {
            id,
            date,
            price,
            paid,
            description
        }
        billings.push(newBilling);
        res.json({message: 'Billing created successfully'});
    }

    public deleteBilling = async (req:Request, res:Response) => {
        const {id} = req.params;
        const bills = billings.find(bill => bill.id === id);
        if (!bills) return res.status(404).json({message: 'Billing not found'});
        billings.splice(billings.indexOf(bills), 1);
        return res.json({message: 'Billing deleted successfully', bill: bills});
    }
}