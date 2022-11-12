// ** Types
import { ThemeColor } from "src/@core/layouts/types";

export type UserLayoutType = {
  id: string | undefined;
};

export type PackagesType = {
  id: number;
  name: string;
  weight: number;
  value: number;
  lengthObj: number;
  width: number;
  height: number;
  user: Object;
};

export type AddressesType = {
  id: number,
  street1: string,
  street2: string,
  city: string,
  region: string,
  postalCode: string,
  country: string,
  residential: string,
  name: string,
  company: string,
  phone: string,
  email: string,
  verified: boolean
}