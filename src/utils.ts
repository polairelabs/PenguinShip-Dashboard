import jsPDF from "jspdf";
import {
  Person,
  PersonType,
  Shipment,
  ShipmentAddress,
  ShipmentAddressType
} from "./types/apps/NavashipTypes";
import { deleteCookie, setCookie } from "cookies-next";

const INSURANCE_FEE_PERCENTAGE = 0.5;

const convertToPdf = (
  imageUrl: string,
  imageWidth: number,
  imageHeight: number
) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const aspectRatio = imageWidth / imageHeight;
  const imgWidthOnPage = pageWidth * 0.6;
  const imgHeightOnPage = imgWidthOnPage / aspectRatio;

  // Centers the image on the page
  const x = (pageWidth - imgWidthOnPage) / 2;
  const y = (pageHeight - imgHeightOnPage) / 2;

  pdf.addImage(imageUrl, "PNG", x, y, imgWidthOnPage, imgHeightOnPage);
  return pdf;
};

export const convertAndDownloadImageToPdf = (
  imageUrl: string,
  imageWidth: number,
  imageHeight: number,
  filename: string
) => {
  const pdf = convertToPdf(imageUrl, imageWidth, imageHeight);
  pdf.save(`${filename}.pdf`);
};

export const printPdf = (
  imageUrl: string,
  imageWidth: number,
  imageHeight: number
) => {
  const pdf = convertToPdf(imageUrl, imageWidth, imageHeight);
  const pdfData = pdf.output("arraybuffer");
  const blob = new Blob([pdfData], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    printWindow.print();
  }
  URL.revokeObjectURL(url);
};

export const capitalizeFirstLetterOnly = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(^|\s)[a-z]/g, (char) => char.toUpperCase());
};

export const dateToHumanReadableFormat = (date: Date) => {
  const dateObj = new Date(date);
  return (
    dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }) +
    ", " +
    dateObj.toLocaleTimeString()
  );
};

export const dateToHumanReadableFormatWithDayOfWeek = (date: Date) => {
  const dateObj = new Date(date);
  return dateObj.toDateString() + ", " + dateObj.toLocaleTimeString();
};

export const calculateInsuranceFee = (insuranceAmount: string) => {
  return (
    Math.round(
      Number(insuranceAmount) * (INSURANCE_FEE_PERCENTAGE / 100) * 100
    ) / 100
  );
};

export const splitStringByCapitalCase = (input: string) => {
  return input?.match(/[A-Z][a-z]+/g)?.join(" ");
};

export const getRecipientInfo = (shipment: Shipment) => {
  const found = shipment.persons.find(
    (person) => person.type === PersonType.RECEIVER
  );
  let receiverName;
  if (found) {
    const receiver: Person = found;
    receiverName =
      capitalizeFirstLetterOnly(receiver.name) ??
      capitalizeFirstLetterOnly(receiver.company);
  }
  const deliveryAddress = getRecipientAddress(shipment);
  return receiverName
    ? capitalizeFirstLetterOnly(receiverName) +
        ", " +
        capitalizeFirstLetterOnly(deliveryAddress.city)
    : capitalizeFirstLetterOnly(deliveryAddress.city);
};

export const getRecipientAddress = (shipment: Shipment) => {
  return shipment.addresses.find(
    (address) => address.type === ShipmentAddressType.DESTINATION
  ) as ShipmentAddress;
};
