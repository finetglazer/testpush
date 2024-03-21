export interface IActionLog {
  id: number;
  userName: string;
  action: string;
  obj: string;
  module: string;
  content: string;
  updateTime: Date;
}
