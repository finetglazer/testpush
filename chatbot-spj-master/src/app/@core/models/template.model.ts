export interface ITemplate {
  id: number;
  templateCode: string;
  freemakerOutput: string;
  description: string;
  status: number;
  clazz: string;
  botId: number;
  updateTime: string;
  updateUser: string;
}

export interface ITemplateDetail {
  template: ITemplate;
  mapTemplateService: IMapTemplateService[];
}

export interface IMapTemplateService {
  id: number;
  templateId: number;
  serviceId: number;
  ord: number;
  status: number;
  updateTime: string;
  updateUser: string;
}
