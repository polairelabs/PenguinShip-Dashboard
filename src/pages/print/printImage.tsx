import React, { useState } from "react";

const PrintImage = ({ src }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open();
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              padding: 0;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <img src="${src}" style="width: 100%; height: auto;">
        </body>
      </html>
    `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <button onClick={handlePrint}>Print</button>
  );
};

export default PrintImage;