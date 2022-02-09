export interface IPerson {
  type: string;
  id: string;
  attributes: IPersonAttributes;
}

export interface IPersonAttributes {
  given_name: string;
  first_name: string;
  nickname: string;
  middle_name?: string;
  last_name: string;
  child: boolean;
}
