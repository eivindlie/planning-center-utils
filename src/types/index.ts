export interface IPlan {
  id: string;
  title: string;
  seriesTitle: string;
  createdAt: Date;
  updatedAt: Date;
  sortDate: Date;
}

export interface IPlanTeamMember {
  id: string;
  name: string;
  teamPositionName: string;
  status: string;
  photoThumbnail: string;
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

export interface ITeam {
  name: string;
  id: string;
  members: ITeamMember[];
}

export interface ITeamMember {
  id: string;
  fullName: string;
}

export interface IBlockoutDate {
  id: string;
  reason: string;
  startsAt: Date;
  endsAt: Date;
}

export interface ITeamMemberWithBlockoutDates {
  member: ITeamMember;
  blockoutDates: IBlockoutDate[];
}

export type UserRole = "admin" | "user" | null;

export interface IFirebaseUserProfile {
  name: string;
  email: string;
  role: UserRole;
}
