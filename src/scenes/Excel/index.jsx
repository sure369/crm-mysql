import React from "react";
import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { IconButton, Tooltip } from '@mui/material'


function ExcelDownload({ data, filename }) {

  const handleDownload = () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Sheet1");

    // Add headers to worksheet
    const headers = Object.keys(data[0]);
    ws.addRow(headers);

    // Add data to worksheet
    data.forEach((row) => {
      const rowValues = Object.values(row);
      ws.addRow(rowValues);
    });

    // Save workbook to file
    wb.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <Tooltip title="Excel Download">
      <IconButton>
        <SaveAltIcon onClick={handleDownload} >Export</SaveAltIcon>
      </IconButton>
    </Tooltip>
  )

}

export default ExcelDownload;