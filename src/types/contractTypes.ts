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
  created_at: string;
  updated_at: string;
  title: string;
  sort_date: string;
}

export interface IApiPlanTeamMember {
  type: string;
  id: string;
  attributes: IApiPlanTeamMemberAttributes;
}

export interface IApiPlanTeamMemberAttributes {
  status: string;
  team_position_name: string;
  name: string;
  photo_thumbnail: string;
}

export interface IApiBlockoutDate {
  id: string;
  attributes: IBlockoutDateAttributes;
}

export interface IBlockoutDateAttributes {
  group_identifier: string;
  reason: string;
  time_zone: string;
  share: boolean;
  starts_at: string;
  ends_at: string;
  starts_at_utc: string;
  ends_at_utc: string;
}
