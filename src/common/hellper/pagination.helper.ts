export interface PaginationOptions {
    page: number;
    limit: number;
  }
  
  export interface PaginationResult<T> {
    items: T[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }
  
  export function paginate<T>(
    data: T[],
    totalItems: number,
    options: PaginationOptions,
  ): PaginationResult<T> {
    const { page, limit } = options;
    const totalPages = Math.ceil(totalItems / limit);
    const items = data.slice((page - 1) * limit, page * limit);
  
    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }