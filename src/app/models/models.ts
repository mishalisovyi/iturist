/* View models */

export interface Profile {
  user_id: number;
  first_name: string;
  last_name: string;
  user: string;
  language: string;
  language_full: string;
  phone: string;
  photo?: string;
  airline_image?: string;
  travel_image?: string;
  passport_image?: string;
}

export interface Plan {
  created: string;
  package?: Package;
  calls?: number;
  company?: string;
  company_id?: number;
  emails?: number;
  id?: number;
  price?: string;
  title?: string;
  traffic?: number;
}

export interface Package {
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
  status: string;
  created: any;
  package: {
    title: string;
  }
}

export interface Language {
  id: number;
  file_url: string;
  title: string;
  title_full: string;
}

export interface Alert {
  title: string;
  subTitle: string;
  link: string;
  pubDate: string;
}

export interface Address {
  city: string;
  street: string;
  number: string;
  note: string;
  zip: string;
}

export interface Company {
  id: number;
  logo: string;
  title: string;
}

/* Request models */

export interface ProfileEditRequest {
  user?: string,
  first_name?: string,
  last_name?: string,
  language?: string,
  phone: string
}

export interface OrderSimCardRequest {
  type: string,
  name: string,
  email: string,
  address: string,
  city: string,
  phone_number: string,
  company: number
}

export interface AppointmentRequest {
  specialization: string,
  visit_date: string,
  type: string,
  note: string
}

export interface CheckupRequest {
  visit_date: string,
  type: string,
  colonoscopy: boolean;
  oncomarker: boolean;
}

/* Response models */

export interface BaseResponse {
  content: any;
  metadata: any;
}