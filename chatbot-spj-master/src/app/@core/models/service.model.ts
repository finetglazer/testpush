export interface IService {
  authType: string;
  contentType: string;
  description: string;
  env: number;
  id: number;
  inputUseFreemaker: number;
  isEscape: number;
  method: number;
  passwordValue: string;
  project: string;
  request: string;
  response: string;
  serviceCode: string;
  status: number;
  type: string;
  updateTime: string;
  updateUser: string;
  url: string;
  urlTest: string;
  userNameValue: string;
}

export interface IServiceDetail {
  services: IService;
  mapServiceParams: IServiceMapParam[];
}

export interface IServiceMapParam {
  id: number;
  serviceId: number;
  businessParam: string;
  botParam: string;
  defaultValue: string;
  location: string;
  status: number;
  type: string;
  updateTime: string;
  updateUser: string;
}
