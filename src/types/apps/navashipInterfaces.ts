// Api response interfaces and whatever else
export interface Package {
  id: number;
  name: string;
  weight: string;
  value: string;
  length: string;
  width: string;
  height: string;
}

export interface Address {
  id: number;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  residential: boolean;
  // Person address info
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  verified?: boolean;
}

export interface Shipment {
  id: number;
  easypostShipmentId: string;
  toAddress: Address;
  fromAddress: Address;
  parcel: Package;
  navashipShipmentStatus: string;
  easypostShipmentStatus: string;
  rate: Rate;
  createdAt: Date;
  updatedAt: Date;
  trackingCode: string;
  postageLabelUrl: string;
  publicTrackingUrl: string;
  additionalInfoJson: string;
}

export interface Rate {
  id: string; // id from easypost
  billingType: string;
  carrier: string;
  carrierAccountId: string;
  currency: string;
  deliveryDateGuaranteed: boolean;
  deliveryDays: number;
  estDeliveryDays: number;
  rate: number;
  retailRate: number;
  service: string;
  shipmentId: string;
}

export interface CreatedShipment {
  id: string; // id from easypost
  rates: Rate[];
}

export interface Person {
  name: string;
  company: string;
  phone: string;
  email: string;
}

export interface Membership {
  name: string;
  description: string;
  stripePriceId: string;
  currency: string;
  unitAmount: number;
}

export interface AccountData {
  firstName: string;
  lastName: string;
  state: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  membershipProductLink: string;
  stripePriceId: string;
}

export enum ShipmentStatus {
  DRAFT = "DRAFT",
  PURCHASED = "PURCHASED",
}
