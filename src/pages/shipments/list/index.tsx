import { memo, useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { DataGrid, GridValueGetterParams } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import CustomChip from "src/@core/components/mui/chip";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "src/store";
import {
  Person,
  PersonType,
  Shipment,
  ShipmentAddress,
  ShipmentAddressType,
  ShipmentStatus
} from "src/types/apps/NavashipTypes";
import {
  clearDeleteStatus,
  deleteShipment,
  fetchShipments,
  setOffset,
  setSize
} from "../../../store/apps/shipments";
import Box from "@mui/material/Box";
import { Link, Tooltip } from "@mui/material";
import {
  capitalizeFirstLetterOnly,
  dateToHumanReadableFormat
} from "../../../utils";
import QuickSearchToolbar from "../../../views/table/data-grid/QuickSearchToolbar";
import { Close, CurrencyUsd } from "mdi-material-ui";
import SelectRateModal from "../../../components/rates/selectRateModal";
import toast from "react-hot-toast";

interface CellType {
  row: Shipment;
}

interface ActionsCellProps {
  row: Shipment | null | undefined;
  hoveredRow: any;
  handleBuyRate: any;
  handleDelete: any;
}

const ShipmentsList = () => {
  const [searchText, setSearchText] = useState("");
  const [hoveredRow, setHoveredRow] = useState<Number | null>(null);
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

  const store = useSelector((state: RootState) => state.shipments);

  const dispatch = useDispatch<AppDispatch>();

  const onMouseEnterRow = (event) => {
    const id = Number(event.currentTarget.getAttribute("data-id"));
    setHoveredRow(id);
  };

  const onMouseLeaveRow = (event) => {
    setHoveredRow(null);
  };

  const handleDialogToggleRateSelect = () => {
    setOpenRateSelect(!openRateSelect);
  };

  const getCarrierImageSrc = (shipment: Shipment) => {
    return `/images/carriers/${shipment?.rate?.carrier?.toLowerCase()}_logo.svg`;
  };

  const getRecipientInfo = (shipment: Shipment) => {
    const found = shipment.persons.find(
      (person) => person.type === PersonType.RECEIVER
    );
    let receiverName;
    if (found) {
      const receiver: Person = found;
      receiverName = receiver.name ?? receiver.company;
    }
    const deliveryAddress = getRecipientAddress(shipment);
    return receiverName
      ? capitalizeFirstLetterOnly(receiverName) +
          ", " +
          capitalizeFirstLetterOnly(deliveryAddress.city)
      : capitalizeFirstLetterOnly(deliveryAddress.city);
  };

  const getRecipientAddress = (shipment: Shipment) => {
    return shipment.addresses.find(
      (address) => address.type === ShipmentAddressType.DESTINATION
    ) as ShipmentAddress;
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    window.localStorage.setItem("shipmentsDataGridSize", size.toString());
  };

  const ActionsCell = memo(
    ({ row, hoveredRow, handleBuyRate, handleDelete }: ActionsCellProps) => {
      if (row) {
        // && hoveredRow === row.ids
        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center"
            }}
          >
            {row.status == ShipmentStatus.PURCHASED && (
              <Tooltip title="Return label">
                <IconButton onClick={() => {}}>
                  <Close />
                </IconButton>
              </Tooltip>
            )}
            {row.status === ShipmentStatus.DRAFT && (
              <Tooltip title="Buy rate">
                <IconButton onClick={() => handleBuyRate(row)}>
                  <CurrencyUsd />
                </IconButton>
              </Tooltip>
            )}
            {row.status === ShipmentStatus.DRAFT && (
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(row.id)}>
                  <DeleteOutline />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      } else {
        return null;
      }
    }
  );

  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    if (!searchValue) {
      setSearchResult([]);
      return;
    }
    const searchRegex = new RegExp(searchValue, "i");
    const filteredRows = store.allShipments.filter((row) => {
      const searchString = [
        row.rate.carrier,
        row.rate.service,
        row.trackingCode,
        row.status,
        getRecipientInfo(row)
      ]
        .join(" ")
        .toLowerCase();
      return searchRegex.test(searchString);
    });

    if (searchValue?.length) {
      setSearchResult(filteredRows);
    } else {
      setSearchResult([]);
    }
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
      minWidth: 250,
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
              {dateToHumanReadableFormat(row?.updatedAt)}
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
        return (
          <ActionsCell
            row={row}
            hoveredRow={hoveredRow}
            handleBuyRate={handleBuyRate}
            handleDelete={handleDelete}
          />
        );
      }
    }
  ];

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
