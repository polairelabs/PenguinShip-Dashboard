import { MouseEvent, useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DotsVertical from "mdi-material-ui/DotsVertical";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import CustomChip from "src/@core/components/mui/chip";

import { useDispatch, useSelector } from "react-redux";

import { deletePackage } from "src/store/apps/packages";

import { AppDispatch, RootState } from "src/store";
import { Person, Shipment } from "src/types/apps/navashipInterfaces";
import { fetchShipments } from "../../../store/apps/shipments";
import Box from "@mui/material/Box";
import { Link, Tooltip } from "@mui/material";
import { capitalizeFirstLettersOnly } from "../../../utils";
import QuickSearchToolbar from "../../../views/table/data-grid/QuickSearchToolbar";
import { CurrencyUsd } from "mdi-material-ui";
import { fetchAddresses } from "../../../store/apps/addresses";
import { escapeRegExp } from "@mui/x-data-grid/utils/utils";

interface CellType {
  row: Shipment;
}

const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary
}));

const RowOptions = ({ id }: { id: number | string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deletePackage(id));
    handleRowOptionsClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <DotsVertical />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      >
        <MenuItem onClick={handleRowOptionsClose}>
          <PencilOutline fontSize="small" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteOutline fontSize="small" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

const getCarrierImageSrc = (shipment: Shipment) => {
  return `/images/carriers/${shipment?.rate?.carrier?.toLowerCase()}_logo.svg`;
};

const getRecipientInfo = (shipment: Shipment) => {
  const json = JSON.parse(shipment?.additionalInfoJson);
  return json["receiver"] as Person;
};

const getRecipientAddress = (shipment: Shipment) => {
  return shipment.toAddress;
};

const dateToHumanReadableFormat = (date: Date) => {
  const dateObj = new Date(date);
  return dateObj.toDateString() + ", " + dateObj.toLocaleTimeString();
};

const ShipmentsList = () => {
  const [searchText, setSearchText] = useState("");
  const [hoveredRow, setHoveredRow] = useState<Number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowCount, setRowCount] = useState(100);

  const store = useSelector((state: RootState) => state.shipments);

  const dispatch = useDispatch<AppDispatch>();

  const onMouseEnterRow = (event) => {
    const id = Number(event.currentTarget.getAttribute("data-id"));
    setHoveredRow(id);
  };

  const onMouseLeaveRow = (event) => {
    setHoveredRow(null);
  };

  useEffect(() => {
    // Called on mount as well
    dispatch(fetchShipments({ offset: currentPage, size: rowCount }));
  }, [currentPage, rowCount]);

  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    // const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    //
    // const filteredRows = data.filter(row => {
    //   return Object.keys(row).some(field => {
    //     // @ts-ignore
    //     return searchRegex.test(row[field].toString())
    //   })
    // })
    // if (searchValue.length) {
    //   setFilteredData(filteredRows)
    // } else {
    //   setFilteredData([])
    // }
  };

  const columns = [
    {
      minWidth: 160,
      field: "carrier",
      headerName: "Carrier",
      cellClassName: "cool",
      renderCell: ({ row }: CellType) => {
        if (row?.rate?.carrier) {
          return (
            <Box
              component="img"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 200,
                height: 25,
                padding: 0
              }}
              alt={row?.rate?.carrier}
              src={getCarrierImageSrc(row)}
            />
          );
        }
      }
    },
    {
      minWidth: 240,
      field: "service",
      headerName: "Service",
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: "text.primary", fontWeight: 600, mb: 0.5 }}
            >
              {row?.rate?.service.toUpperCase()}
            </Typography>
            <Link
              href={row?.postageLabelUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
            >
              {row?.trackingCode}
            </Link>
          </Box>
        );
      }
    },
    {
      minWidth: 150,
      field: "status",
      headerName: "Status",
      renderCell: ({ row }: CellType) => {
        // status can either come from easypost or navaship api (if easypost status is unknown use the navaship status)
        // Status in easypost is unknown until it is scanned by the carrier
        const status =
          row?.navashipShipmentStatus !== "DRAFT"
            ? row?.easypostShipmentStatus === "unknown"
              ? row?.navashipShipmentStatus
              : row?.easypostShipmentStatus
            : row?.navashipShipmentStatus;
        const statusColors = {
          purchased: "primary",
          delivered: "success",
          draft: "info",
          unknown: "info"
        };
        const statusColor = statusColors[status?.toLowerCase()];

        return (
          <CustomChip
            size="small"
            skin="light"
            color={statusColor}
            label={status}
            sx={{ "& .MuiChip-label": { textTransform: "capitalize" } }}
          />
        );
      }
    },
    {
      minWidth: 250,
      field: "recipient",
      headerName: "Recipient",
      renderCell: ({ row }: CellType) => {
        const recipientInfo = getRecipientInfo(row);
        const recipient = recipientInfo.name ?? recipientInfo.company;
        const recipientAddress = getRecipientAddress(row);

        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {recipient ? capitalizeFirstLettersOnly(recipient) : ""}{" "}
              {recipientAddress
                ? capitalizeFirstLettersOnly(recipientAddress.city)
                : ""}
            </Typography>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: "text.primary", fontWeight: "light" }}
            >
              {recipientAddress ? `${recipientAddress.state},` : ""}{" "}
              {recipientAddress ? `${recipientAddress.zip},` : ""}{" "}
              {recipientAddress ? `${recipientAddress.country},` : ""}
            </Typography>
          </Box>
        );
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: "date",
      headerName: "Date",
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: "flex" }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {dateToHumanReadableFormat(row?.createdAt)}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        if (hoveredRow === row.id) {
          return (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Tooltip title="Buy rate">
                <IconButton onClick={() => {}}>
                  <CurrencyUsd />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => {}}>
                  <DeleteOutline />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } else return null;
      }
    }
  ];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            rows={store.allShipments}
            columns={columns}
            disableSelectionOnClick
            pagination
            paginationMode="server"
            rowsPerPageOptions={[2, 50, 100]}
            rowCount={store.total}
            onPageSizeChange={(count) => setRowCount(count)}
            onPageChange={(newPage) => setCurrentPage(newPage + 1)}
            disableColumnSelector
            components={{ Toolbar: QuickSearchToolbar }}
            componentsProps={{
              toolbar: {
                value: searchText,
                clearSearch: () => handleSearch(""),
                onChange: (event) => handleSearch(event.target.value),
                searchTxtPlaceHolder: "Search labels..."
              },
              row: {
                onMouseEnter: onMouseEnterRow,
                onMouseLeave: onMouseLeaveRow
              }
            }}
            sx={{
              "& .MuiDataGrid-columnHeadersInner .MuiDataGrid-columnHeader:nth-last-of-type(2) .MuiDataGrid-columnSeparator":
                {
                  display: "none"
                }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ShipmentsList;
