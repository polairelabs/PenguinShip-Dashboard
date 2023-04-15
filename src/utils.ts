import jsPDF from "jspdf";
import {
  Person,
  PersonType,
  Shipment,
  ShipmentAddress,
  ShipmentAddressType
} from "./types/apps/NavashipTypes";

const INSURANCE_FEE_PERCENTAGE = 0.5;

const convertToPdf = (
  dataUrl: string,
  imageWidth: number,
  imageHeight: number
) => {
  const inchesToPt = (inches: number) => inches * 72;
  const pageWidth = inchesToPt(4);
  const pageHeight = inchesToPt(6);

  // Create a PDF with custom dimensions (4" x 6")
  const pdf = new jsPDF({ format: [pageWidth, pageHeight] });

  // Calculate the aspect ratio of the image and the page
  const imageAspectRatio = imageWidth / imageHeight;
  const pageAspectRatio = pageWidth / pageHeight;

  let imgWidthOnPage = pageWidth;
  let imgHeightOnPage = pageHeight;

  // Calculate dimensions that maintain the aspect ratio and fill the page
  if (imageAspectRatio > pageAspectRatio) {
    imgHeightOnPage = pageWidth / imageAspectRatio;
  } else {
    imgWidthOnPage = pageHeight * imageAspectRatio;
  }

  // Centers the image on the page
  const x = (pageWidth - imgWidthOnPage) / 2;
  const y = (pageHeight - imgHeightOnPage) / 2;

  pdf.addImage(dataUrl, "PNG", x, y, imgWidthOnPage, imgHeightOnPage);
  return pdf;
};

export const convertAndDownloadImageToPdf = (
  dataUrl: string,
  imageWidth: number,
  imageHeight: number,
  filename: string
) => {
  const pdf = convertToPdf(dataUrl, imageWidth, imageHeight);
  pdf.save(`${filename}.pdf`);
};

export const printPdf = (
  dataUrl: string,
  imageWidth: number,
  imageHeight: number
) => {
  const pdf = convertToPdf(dataUrl, imageWidth, imageHeight);
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
  return date.toDateString() + ", " + date.toLocaleTimeString();
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
