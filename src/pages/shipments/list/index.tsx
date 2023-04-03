import { useContext, useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { DataGrid, GridValueGetterParams } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CustomChip from "src/@core/components/mui/chip";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "src/store";
import { Shipment, ShipmentStatus } from "src/types/apps/NavashipTypes";
import {
  clearDeleteStatus,
  deleteShipment,
  fetchShipments,
  setOffset,
  setSize
} from "../../../store/apps/shipments";
import Box from "@mui/material/Box";
import { Dialog, DialogContent, Link, Tooltip } from "@mui/material";
import {
  dateToHumanReadableFormatWithDayOfWeek,
  getRecipientAddress,
  getRecipientInfo
} from "../../../utils";
import QuickSearchToolbar from "../../../views/table/data-grid/QuickSearchToolbar";
import { CurrencyUsd, Delete, Printer, Undo } from "mdi-material-ui";
import SelectRateModal from "../../../components/rates/selectRateModal";
import toast from "react-hot-toast";
import ReturnConfirmationDialog from "../../../components/dialog/returnConfirmationDialog";
import { AbilityContext } from "../../../layouts/components/acl/Can";
import PrintShippingLabel from "../../../components/shipments/printShippingLabel";

interface CellType {
  row: Shipment;
}

const ShipmentsList = () => {
  const ability = useContext(AbilityContext);
  const enableDeleteButton = ability?.can("delete", "entity");

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    const storedPageSize = localStorage.getItem("shipmentsDataGridSize");
    return storedPageSize ? Number(storedPageSize) : 100;
  });

  const [openRateSelect, setOpenRateSelect] = useState<boolean>(false);
  const [selectedShipment, setSelectedShipment] = useState<
    Shipment | undefined
  >(undefined);

  const [searchResult, setSearchResult] = useState<Shipment[]>([]);

  const [returnConfirmationDialog, setReturnConfirmationDialog] =
    useState<boolean>(false);

  const [printLabelDialogOpen, setPrintLabelDialogOpen] = useState<boolean>(false);

  const store = useSelector((state: RootState) => state.shipments);
  const dispatch = useDispatch<AppDispatch>();

  const handleDialogToggleRateSelect = () => {
    setOpenRateSelect(!openRateSelect);
  };

  const getCarrierImageSrc = (shipment: Shipment) => {
    return `/images/carriers/${shipment?.rate?.carrier?.toLowerCase()}_logo.svg`;
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    window.localStorage.setItem("shipmentsDataGridSize", size.toString());
  };

  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    if (!searchValue) {
      setSearchResult([]);
      return;
    }
    const searchRegex = new RegExp(searchValue, "i");
    const filteredRows = store.allShipments.filter((row) => {
      const searchString = [
        row.rate?.carrier,
        row.rate?.service,
        row?.trackingCode,
        row?.status,
        getRecipientInfo(row)
      ]
        .join(" ")
        .toLowerCase();
      return searchRegex.test(searchString);
    });

    if (filteredRows?.length) {
      setSearchResult(filteredRows);
    } else {
      setSearchResult([]);
    }
  };

  const handlePrintLabelDialogToggle = () => {
    setPrintLabelDialogOpen(!printLabelDialogOpen);
  };

  const columns = [
    {
      minWidth: 160,
      field: "carrier",
      headerName: "Carrier",
      type: "text",
      valueGetter: (params: GridValueGetterParams) => {
        return params.row.rate?.carrier.toLowerCase() || "";
      },
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
      type: "text",
      valueGetter: (params: GridValueGetterParams) => {
        return params.row.rate?.service.toLowerCase() || "";
      },
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
        // const status =
        //   row?.navashipShipmentStatus !== "DRAFT"
        //     ? row?.easypostShipmentStatus === "unknown"
        //       ? row?.navashipShipmentStatus
        //       : row?.easypostShipmentStatus
        //     : row?.navashipShipmentStatus;
        const status = row.status;
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
      minWidth: 265,
      field: "recipient",
      headerName: "Recipient",
      type: "text",
      valueGetter: (params: GridValueGetterParams) => {
        return getRecipientInfo(params.row);
      },
      renderCell: ({ row }: CellType) => {
        const recipientInfo = getRecipientInfo(row);
        const recipientAddress = getRecipientAddress(row);

        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {recipientInfo}
            </Typography>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: "text.primary", fontWeight: "light" }}
            >
              {recipientAddress ? `${recipientAddress.state},` : ""}{" "}
              {recipientAddress ? `${recipientAddress.zip},` : ""}{" "}
              {recipientAddress ? `${recipientAddress.country}` : ""}
            </Typography>
          </Box>
        );
      }
    },
    {
      minWidth: 110,
      field: "insurance",
      headerName: "Insurance",
      renderCell: ({ row }: CellType) => {
        const insured = row.insured;
        if (insured) {
          return (
            <CustomChip
              title={`Insured for $${row.insuranceAmount}`}
              size="small"
              skin="light"
              color={"success"}
              label={"INSURED"}
              sx={{ "& .MuiChip-label": { textTransform: "capitalize" } }}
            />
          );
        }
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: "date",
      headerName: "Date",
      type: "date",
      valueGetter: (params: GridValueGetterParams) => {
        return params.row.updatedAt;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: "flex" }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {dateToHumanReadableFormatWithDayOfWeek(row?.createdAt)}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: "actions",
      headerName: "",
      flex: 0.25,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        if (row) {
          return (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
                // visibility: hoveredRow == row.id ? "visible" : "hidden"
              }}
            >
              {row.status == ShipmentStatus.PURCHASED && (
                <Tooltip title="Print label" disableInteractive={true}>
                  <IconButton
                    onClick={() => {
                      setSelectedShipment(row);
                      setPrintLabelDialogOpen(true);
                    }}
                  >
                    <Printer />
                  </IconButton>
                </Tooltip>
              )}
              {row.status == ShipmentStatus.PURCHASED && (
                <Tooltip title="Return label" disableInteractive={true}>
                  <IconButton
                    onClick={() => {
                      handleReturnLabel();
                    }}
                  >
                    <Undo />
                  </IconButton>
                </Tooltip>
              )}
              {row.status === ShipmentStatus.DRAFT && (
                <Tooltip title="Buy rate" disableInteractive={true}>
                  <IconButton onClick={() => handleBuyRate(row)}>
                    <CurrencyUsd />
                  </IconButton>
                </Tooltip>
              )}
              {row.status === ShipmentStatus.DRAFT && (
                <Tooltip title="Delete" disableInteractive={true}>
                  <IconButton
                    disabled={!enableDeleteButton}
                    onClick={() => handleDelete(row.id)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        } else {
          return null;
        }
      }
    }
  ];

  const handleConfirmationReturnDialogToggle = () => {
    setReturnConfirmationDialog(!returnConfirmationDialog);
  };

  const handleReturnLabel = () => {
    setReturnConfirmationDialog(true);
  };

  const handleBuyRate = (shipment: Shipment) => {
    setOpenRateSelect(true);
    setSelectedShipment(shipment);
  };

  const handleDelete = (id) => {
    dispatch(deleteShipment(id));
  };

  useEffect(() => {
    // Called when first mounted as well
    dispatch(
      fetchShipments({ offset: currentPage, size: pageSize, order: "desc" })
    );
    dispatch(setOffset(currentPage));
    dispatch(setSize(pageSize));
  }, [currentPage, pageSize]);

  // Delete toast
  useEffect(() => {
    if (store.deleteStatus === "SUCCESS") {
      toast.success("Shipment was successfully deleted", {
        position: "top-center"
      });
    } else if (store.deleteStatus === "ERROR") {
      toast.error("Error deleting shipment", {
        position: "top-center"
      });
    }
    dispatch(clearDeleteStatus());
  }, [store.deleteStatus]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <SelectRateModal
            open={openRateSelect}
            handleDialogToggle={handleDialogToggleRateSelect}
            shipment={selectedShipment}
          />
          <DataGrid
            autoHeight
            rows={searchResult?.length > 0 ? searchResult : store.allShipments}
            columns={columns}
            disableSelectionOnClick
            pagination
            paginationMode="server"
            rowsPerPageOptions={[20, 50, 100]}
            pageSize={pageSize}
            rowCount={store.total}
            onPageSizeChange={(count) => onPageSizeChange(count)}
            onPageChange={(newPage) => setCurrentPage(newPage + 1)}
            disableColumnSelector
            components={{ Toolbar: QuickSearchToolbar }}
            componentsProps={{
              toolbar: {
                value: searchText,
                clearSearch: () => handleSearch(""),
                onChange: (event) => handleSearch(event.target.value),
                searchTxtPlaceHolder: "Search labels..."
              }
            }}
            sx={{
              "& .MuiDataGrid-columnHeadersInner .MuiDataGrid-columnHeader:nth-last-of-type(2) .MuiDataGrid-columnSeparator":
                {
                  display: "none"
                }
            }}
          />
          <ReturnConfirmationDialog
            open={returnConfirmationDialog}
            handleDialogToggle={handleConfirmationReturnDialogToggle}
            title={"Do you want to return this label?"}
            confirmButtonCallback={() => {}}
            shipment={selectedShipment}
          />
          {selectedShipment && (
            <Dialog
              fullWidth
              open={printLabelDialogOpen}
              maxWidth="md"
              onClose={handlePrintLabelDialogToggle}
              onBackdropClick={handlePrintLabelDialogToggle}
              key={"print-shipping-label"}
            >
              <DialogContent>
                <PrintShippingLabel shipment={selectedShipment} />
              </DialogContent>
            </Dialog>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ShipmentsList;
