import { useState, useEffect, MouseEvent, ReactElement } from "react";

import Box from "@mui/material/Box";
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

import { fetchAddresses } from "src/store/apps/addresses";

import { RootState, AppDispatch } from "src/store";
import { Address } from "src/types/apps/navashipInterfaces";

import AddressModal from "src/components/addresses/addressModal";
import TableHeader from "../../../views/packages/list/TableHeader";

interface CellType {
  row: Address;
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    // dispatch(deletePackages(id));
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
    field: "street1",
    headerName: "Street 1",
    renderCell: ({ row }: CellType) => {
      return <Typography noWrap>{row.street1}</Typography>;
    }
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "street2",
    headerName: "Street 2",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography
          noWrap
          sx={{
            color: "text.secondary"
          }}
        >
          {row.street2}
        </Typography>
      );
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "City",
    field: "city",
    renderCell: ({ row }: CellType) => {
      return <Typography noWrap>{row.city}</Typography>;
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "zip",
    headerName: "Zip Code",
    renderCell: ({ row }: CellType) => {
      return <Typography noWrap>{row.zip}</Typography>;
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "state",
    headerName: "State",
    renderCell: ({ row }: CellType) => {
      return <Typography noWrap>{row.state}</Typography>;
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "country",
    headerName: "Country",
    renderCell: ({ row }: CellType) => {
      return <Typography noWrap>{row.country}</Typography>;
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

const AddressesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.addresses);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            toggle={handleDialogToggle}
            toggleLabel="Create address"
          />
          <AddressModal
            open={open}
            handleDialogToggle={handleDialogToggle}
            setCreatedAddress={undefined}
          />

          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            disableColumnSelector
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default AddressesList;
