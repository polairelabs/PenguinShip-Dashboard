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

import { useDispatch, useSelector } from "react-redux";

import { deletePackage } from "src/store/apps/packages";

import { AppDispatch, RootState } from "src/store";
import { Package, Shipment } from "src/types/apps/navashipInterfaces";

import TableHeader from "src/views/packages/list/TableHeader";
import PackageModal from "../../../components/packages/packagesModal";
import { fetchShipments } from "../../../store/apps/shipments";

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

const columns = [
  {
    flex: 0.2,
    minWidth: 250,
    field: "trackingcode",
    headerName: "Tracking Code",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap>
          {row.trackingCode}
        </Typography>
      );
    }
  },
];

const ShipmentsList = () => {
  const [value, setValue] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.shipments);

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  useEffect(() => {
    console.log(store.allShipments);
  }, [store.allShipments]);

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader toggle={handleDialogToggle} toggleLabel="Add parcel" />
          <PackageModal open={open} handleDialogToggle={handleDialogToggle} setCreatedPackage={undefined} />

          <DataGrid
            autoHeight
            rows={store.allShipments}
            columns={columns}
            checkboxSelection
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
