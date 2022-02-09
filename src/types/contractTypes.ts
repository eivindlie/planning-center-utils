export interface IApiPerson {
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

export interface IApiPlan {
  type: string;
  id: string;
  attributes: IPlanAttributes;
}

export interface IPlanAttributes {
  created_at: "string";
  updated_at: "string";
  title: string;
  sort_date: string;
}
