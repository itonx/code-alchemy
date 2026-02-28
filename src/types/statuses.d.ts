declare module "statuses" {
  type StatusMap = Record<number, string>;

  interface StatusLookup {
    (code: number): string;
    (code: string): number | string;
    message: StatusMap;
    code: Record<string, number>;
    codes: number[];
    redirect: Record<number, boolean>;
    empty: Record<number, boolean>;
    retry: Record<number, boolean>;
  }

  const statuses: StatusLookup;
  export default statuses;
}
