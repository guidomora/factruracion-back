import { PaginationDto } from "../../Dtos/pagination";
import { Bill } from "../../dataSource/models/billModel";

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
                previous: (page-1 > 0) ? `/billing?page=${page - 1}&limit=${limit}` : null,
                sortedBillings
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// import { PaginationDto } from "../../Dtos/pagination";
// import { Bill } from "../../dataSource/models/billModel";

// export class BillService {
//     constructor() { }

//     async getBillings(paginationDto: PaginationDto) {
//         const { page, limit } = paginationDto;

//         try {
//             // Calcula el índice de inicio y fin para la paginación
//             const startIndex = (page - 1) * limit;
//             const endIndex = page * limit;

//             // Obtiene el número total de facturas
//             const total = await Bill.countDocuments();

//             // Obtiene las facturas de acuerdo a la paginación
//             const allBills = await Bill.find().skip(startIndex).limit(limit);

//             // Ordena las facturas por fecha de forma descendente
//             const sortedBillings = allBills.sort((a, b) => {
//                 const dateA = new Date(a.date.split('/').reverse().join('-'));
//                 const dateB = new Date(b.date.split('/').reverse().join('-'));
//                 return dateB.getTime() - dateA.getTime();
//             });

//             // Calcula si hay una página siguiente y/o anterior
//             const hasNextPage = endIndex < total;
//             const hasPreviousPage = startIndex > 0;

//             // Construye las URLs de las páginas siguiente y/o anterior
//             const nextPage = hasNextPage ? `/billing?page=${page + 1}&limit=${limit}` : null;
//             const previousPage = hasPreviousPage ? `/billing?page=${page - 1}&limit=${limit}` : null;

//             return {
//                 total,
//                 limit,
//                 nextPage,
//                 previousPage,
//                 sortedBillings
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }
