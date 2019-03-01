/* View models */

export interface Profile {
  user_id: number;
  first_name: string;
  user: string;
  language: string;
  language_long: string;
  photo?: string;
  airline_image?: string;
  travel_image?: string;
  passport_image?: string;
}

export interface Plan {
  calls: number;
  company: string;
  company_id: number;
  emails: number;
  id: number;
  price: string;
  title: string;
  traffic: number;
}

export interface History {
  type: string;
  title: string;
  status: "pending" | "done";
  created: Date
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