import { PaginationDto } from "../../Dtos/pagination";
import { Bill } from '../../dataSource/models/billModel';
import { Billing } from "../billing/controllers";

export class BillService {
  constructor() { }

  async getBillings(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const total = await Bill.countDocuments();
      const billsFromDb = await Bill.find()
        .skip((page - 1) * limit)
        .limit(limit);
      const sortedBillings = billsFromDb.sort((a, b) => { // Ordena las facturas por fecha de forma descendente
        const dateA = new Date(a.date.split('/').reverse().join('-')); // Convierte la fecha a un objeto Date
        const dateB = new Date(b.date.split('/').reverse().join('-'));

        return dateB.getTime() - dateA.getTime(); // Compara las fechas y devuelve el resultado
      });



      return {
        total,
        limit,
        next: `/billing?page=${page + 1}&limit=${limit}`,
        previous: (page - 1 > 0) ? `/billing?page=${page - 1}&limit=${limit}` : null,
        sortedBillings
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getBillingsByPagination(page: number, limit: number) {
    const skip = (page - 1) * limit;


    try {
      const totalItems = await Bill.countDocuments();
      const billsFromDb = await Bill.aggregate([
        {
          $addFields: {
            dateISO: {
              $dateFromString: {
                dateString: {
                  $concat: [
                    { $substr: ["$date", 6, 4] },
                    "-",
                    { $substr: ["$date", 3, 2] },
                    "-",
                    { $substr: ["$date", 0, 2] }
                  ]
                },
                format: "%Y-%m-%d"
              }
            }
          }
        },
        { $sort: { dateISO: -1 } }, // Ordena por la fecha convertida en orden descendente
        { $skip: skip },
        { $limit: limit }
      ]);
      // const sortedBillings = billsFromDb.sort((a, b) => { // Ordena las facturas por fecha de forma descendente
      //     const dateA = new Date(a.date.split('/').reverse().join('-')); // Convierte la fecha a un objeto Date
      //     const dateB = new Date(b.date.split('/').reverse().join('-'));

      //     return dateB.getTime() - dateA.getTime(); // Compara las fechas y devuelve el resultado
      // });

      return { billsFromDb, totalItems }
    } catch (error) {
      console.log(error);
    }
  }

  async unpaidData() {
    try {
      const unpaidBills = await Bill.find({paid:'No'})
      return unpaidBills
    } catch (error) {
      console.log(error);
    }
  }
}







