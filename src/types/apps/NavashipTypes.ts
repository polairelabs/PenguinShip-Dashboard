// Api response interfaces and whatever else
import { fetchDashboardStats } from "../../store/auth";

export interface Package {
  id: number;
  name: string;
  weight: string;
  value: string;
  length: string;
  width: string;
  height: string;
}

export interface ShipmentInsurance {
  isInsured: boolean;
  insuranceAmount?: string;
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
  // Handled in CreateShipmentWizard
  // Person address info
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  verified?: boolean;
}

export interface ShipmentAddress extends Address {
  type: ShipmentAddressType;
}

export interface Shipment {
  id: number;
  easypostShipmentId: string;
  addresses: ShipmentAddress[];
  parcel: Package;
  status: ShipmentStatus;
  easyPostStatus: string;
  rate: Rate;
  createdAt: Date;
  updatedAt: Date;
  trackingCode: string;
  postageLabelUrl: string;
  publicTrackingUrl: string;
  persons: Person[];
  insured: boolean;
  insuranceAmount?: string;
}

// Response from Shipment buy endpoint
export interface BoughtShipment {
  id: number;
  easypostShipmentId: string;
  toAddress: number; // id from db
  fromAddress: number; // id from db
  parcel: number; // id from db
  rate: Rate;
  postageLabelUrl: string;
  postageLabelPdfUrl: string;
  trackingCode: string;
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
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  type: PersonType;
}

export interface Membership {
  id: string;
  name: string;
  description: string;
  currency: string;
  unitAmount: number;
  maxLimit: number;
  // Populated when admin request
  stripePriceId: string;
  shipmentHandlingFee: number;
}

export interface MembershipAdminResponse extends Membership {
  stripePriceId: string;
  handlingFee: number;
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
}

export interface SubscriptionDetail {
  currentLimit: number;
  cardLastFourDigits?: string;
  cardType?: string;
  subscriptionPlan: SubscriptionPlan;
}

export interface SubscriptionPlan {
  name: string;
  maxLimit: number;
}

export interface DashboardStatistics {
  totalShipmentsCreatedCount: number;
  totalShipmentsDeliveredCount: number;
  totalShipmentsInTransitCount: number;
  totalShipmentsDraftCount: number;
  totalPackagesCount: number;
  totalMoneySaved: number;
  currentMonthShipmentCreated: number;
  maxShipmentCreatedLimit: number;
  logs: ActivityLog[];
}

export interface ActivityLog {
  message: string;
  messageType: ActivityMessageType;
  createdAt: Date;
  shipment: Shipment;
}

export enum ShipmentStatus {
  DRAFT = "DRAFT",
  PURCHASED = "PURCHASED"
}

export enum ActivityMessageType {
  NEW = "NEW",
  STATUS_UPDATE = "STATUS_UPDATE",
  PURCHASE = "PURCHASE",
  RETURN = "RETURN",
  NONE = "NONE"
}

export enum PersonType {
  SENDER = "SENDER",
  RECEIVER = "RECEIVER"
}

export enum ShipmentAddressType {
  SOURCE = "SOURCE",
  DESTINATION = "DESTINATION"
}
