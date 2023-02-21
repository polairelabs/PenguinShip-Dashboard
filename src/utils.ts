import jsPDF from "jspdf";

export const capitalizeAndLowerCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(^|\s)[a-z]/g, (char) => char.toUpperCase());
};

const convertToPdf = (
  imageUrl: string,
  imageWidth: number,
  imageHeight: number
) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const aspectRatio = imageWidth / imageHeight;
  // Take 70% of original image
  const imgWidthOnPage = pageWidth * 0.7;
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
