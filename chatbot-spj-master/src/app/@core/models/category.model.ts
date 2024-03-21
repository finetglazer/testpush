export interface ICategoryItem {
  categoryId: number;
  categoryParentId: number | null;
  description: string | null;
  id: number;
  itemCode: string;
  itemName: string;
  itemValue: string;
  parentId: number | null;
  position: number;
  status: number;
  categoryName: string | null;
  parentName: string | null;
  updateTime: string;
  updateUser: string;
}

export interface ICategory {
  id: number;
  categoryCode: string;
  categoryName: string;
  status: string;
  creator: string;
  updateTime: Date;
}
