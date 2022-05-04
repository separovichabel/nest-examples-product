import { QueryInterface } from '../dtos/query.interface';

export interface ExportServiceInterface<T> {
  findAll(query: QueryInterface);
  create(entity: T): Promise<any>;
}
