export interface ILogChat {
  id: number;
  actionType: string;
  botCode: string;
  category?: string;
  content: string;
  createdDate: Date;
  isQuestion: 1 | 0;
  token: string;
  userId: string;
  userName: string;
  msisdn: string;
}

export interface ILogChatTemplate {
  id: number;
  userId: string;
  userName: string;
  sessionId: string;
  wsRequest: string;
  wsResponse: string;
  templateCode: string;
  createdDate: Date;
  transId: string;
}

export interface ILogChatAPI {
  id: number;
  userId: string;
  userName: string;
  sessionId: string;
  wsRequest: string;
  wsResponse: string;
  serviceId: number;
  serviceCode?: string;
  templateCode: string;
  createdDate: Date;
  transId: string;
  token: string;
}
