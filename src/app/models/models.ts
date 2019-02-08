/* View models */

export interface Profile {
  user_id: number;
  first_name: string;
  user: string;
  language: string;
  photo?: string;
  airline_image?: string;
  travel_image?: string;
  passport_image?: string;
}

/* Request models */

export interface ProfileEditRequest {
  email: string,
  first_name: string,
  language: string
}

/* Response models */

export interface BaseResponse {
  content: any;
  metadata: any;
}