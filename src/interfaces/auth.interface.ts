export interface GoogleTokenInterface {
  access_token: string;
  expires_in: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface GoogleMemberInterface {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
