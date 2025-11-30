type QueryResult = Promise<pg.QueryResult<any>>;
function deleteRecord(id: number): QueryResult;

declare namespace db {
  export function query(sql: string, args: any[]): QueryResult;
  export function read(id: string, fields: string[]): QueryResult;
  export function create(record: any): QueryResult;
  export function update(
    id: string,
    record: any,
    fields: string[],
  ): QueryResult;
  export { deleteRecord as delete };
}
