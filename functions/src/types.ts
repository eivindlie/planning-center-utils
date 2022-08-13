export interface IProfileResponse {
  data: {
    id: string;
    attributes: IProfileAttributes;
  };
  included: IProfileIncludedEmail[];
}

export interface IProfileAttributes {
  first_name: string;
  middle_name?: string;
  last_name: string;
  status: string;
}

export interface IProfileIncludedEmail {
  type: "Email" | string;
  attributes: {
    primary: boolean;
    address: string;
  };
}

export interface ITokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}
