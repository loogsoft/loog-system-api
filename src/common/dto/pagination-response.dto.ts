export class PaginationResponseDto<T> {
  data: T[];
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}
