export interface Profile {
  name: string;
  email: string;
  language: string;
  profile_photo?: string;
  airline_photo?: string;
  travel_photo?: string;
  passport_photo?: string;
}

export interface BaseResponse {
  content: any;
  metadata: any;
}