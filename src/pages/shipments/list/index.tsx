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

import TableHeader from "src/views/packages/list/TableHeader";
import { fetchShipments } from "../../../store/apps/shipments";
import Box from "@mui/material/Box";
import { Link } from "@mui/material";

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

const lowerCaseAllWordsExceptFirstLetters = (word: string) =>
  word.replaceAll(/\S*/g, (w) => `${w.slice(0, 1)}${w.slice(1).toLowerCase()}`);

const capitalizeFirstLettersOnly = (word: string) => {
  const words = word.split(" ");
  return words
    .map(lowerCaseAllWordsExceptFirstLetters)
    .map(
      (w) =>
        w?.charAt(0).toUpperCase() +
        w?.slice(1) +
        (words.indexOf(w) === words.length - 1 ? "," : " ")
    );
};

const dateToHumanReadableFormat = (date: Date) => {
  return (
    new Date(date).toDateString() + ", " + new Date(date).toLocaleTimeString()
  );
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
          ></Box>
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
      const status =
        row?.navashipShipmentStatus !== "DRAFT"
          ? row?.easypostShipmentStatus === "unknown"
            ? row?.navashipShipmentStatus
            : row?.easypostShipmentStatus
          : row?.navashipShipmentStatus;
      console.log("status", status);
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
            {recipientAddress ? recipientAddress.state : ""},{" "}
            {recipientAddress ? recipientAddress.zip : ""},{" "}
            {recipientAddress ? recipientAddress.country : ""}
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
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: "actions",
    headerName: "Actions",
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
];

const ShipmentsList = () => {
  const [value, setValue] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.shipments);

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader toggle={handleDialogToggle} toggleLabel="Create Label" />

          <DataGrid
            autoHeight
            rows={store.allShipments}
            columns={columns}
            pageSize={value}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setValue(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ShipmentsList;
