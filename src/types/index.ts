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
  personId: string;
  teamId: string;
  name: string;
  teamPositionName: string;
  status: string;
  photoThumbnail: string;
}

export type PlanTeamMembersMap = { [planId: string]: IPlanTeamMember[] };

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
  isLeader?: boolean;
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

export interface ITeamWithBlockouts {
  id: string;
  teamName: string;
  membersWithBlockouts: ITeamMemberWithBlockoutDates[];
}

export type UserRole = "admin" | "user" | null;

export interface IFirebaseUserProfile {
  name: string;
  email: string;
  role: UserRole;
}

export interface ISong {
  id: string;
  title: string;
  author: string;
  copyright: string;
  ccliNumber: number | undefined;
  lastScheduledAt: Date | undefined;
}
