export interface Package {
  id: number;
  name: string;
  weight: number;
  value: number;
  length: number;
  width: number;
  height: number;
};

export interface Address {
  id: number,
  street1: string,
  street2: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  residential: boolean,
  // Person address info
  name: string,
  company: string,
  phone: string,
  email: string,
  verified: boolean
}