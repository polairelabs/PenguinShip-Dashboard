// ** Types
import { ThemeColor } from "src/@core/layouts/types";

export type UserLayoutType = {
  id: string | undefined;
};

export type Package = {
  id: number;
  name: string;
  weight: number;
  value: number;
  length: number;
  width: number;
  height: number;
};

export type Address = {
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