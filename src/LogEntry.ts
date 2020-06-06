export interface LogEntry {
  logLevel: number;
  moduleName: string;
  location?: string;
  message: any;
}
