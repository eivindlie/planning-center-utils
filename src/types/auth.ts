export interface IPcTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface ITokenResponse {
  planningCenterResponse: IPcTokenResponse;
  firebaseToken: string;
}
