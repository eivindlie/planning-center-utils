export interface IPlan {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  sortDate: Date;
}

export interface IPerson {
  id: string;
  givenName: string;
  firstName: string;
  nickname: string;
  middleName?: string;
  lastName: string;
  child: boolean;
}
