export const offsetFor = (page: number, limit: number): number => (page - 1) * limit;
export const totalPagesFor = (total: number, limit: number): number => Math.ceil(total / limit);
