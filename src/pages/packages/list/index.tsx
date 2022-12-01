import { useState, useEffect, MouseEvent, useCallback } from "react";

import Link from "next/link";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import EyeOutline from "mdi-material-ui/EyeOutline";
import DotsVertical from "mdi-material-ui/DotsVertical";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";

import { useDispatch, useSelector } from "react-redux";

import { fetchPackages, deletePackage } from "src/store/apps/packages";

// ** Types Imports
import { RootState, AppDispatch } from "src/store";
import { PackagesType } from "src/types/apps/userTypes";

// ** Custom Components Imports
import TableHeader from "src/views/packages/list/TableHeader";
import AddPackageDrawer from "src/views/packages/list/AddPackagesDrawer";
import Button from "@mui/material/Button";
import AddressModal from "../../../components/addresses/addressModal";
import PackageModal from "../../../components/packages/packagesModal";

interface CellType {
  row: PackagesType;
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
        <MenuItem sx={{ p: 0 }}>
          <Link href={`/apps/user/view/${id}`} passHref>
            <MenuItemLink>
              <EyeOutline fontSize="small" sx={{ mr: 2 }} />
              View
            </MenuItemLink>
          </Link>
        </MenuItem>
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
    minWidth: 230,
    field: "name",
    headerName: "Name",
    renderCell: ({ row }: CellType) => {
      const { id, name, weight } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column"
            }}
          >
            <Typography>{row.name}</Typography>
          </Box>
        </Box>
      );
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: "weight",
    headerName: "weight",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant="body2">
          {row.weight}
        </Typography>
      );
    }
  },
  {
    flex: 0.15,
    field: "value",
    minWidth: 150,
    headerName: "Value",
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            noWrap
            sx={{
              color: "text.secondary",
              textTransform: "capitalize"
            }}
          >
            {row.value}
          </Typography>
        </Box>
      );
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "width",
    headerName: "Width",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ textTransform: "capitalize" }}>
          {row.width}
        </Typography>
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

const PackagesList = () => {
  const [value, setValue] = useState<number>(10);
  const [addPackageOpen, setAddPackageOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const toggleAddPackageDrawer = () => setAddPackageOpen(!addPackageOpen);

  const data = () => {
    debugger;
    console.log("STORE DATA", store.data);
    if (store.data) {
      return store.data;
    }
    return "";
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader toggle={handleDialogToggle} toggleLabel="Add package" />
          <PackageModal open={open} handleDialogToggle={handleDialogToggle} />

          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            checkboxSelection
            pageSize={value}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setValue(newPageSize)}
          />
        </Card>
      </Grid>
      <AddPackageDrawer open={addPackageOpen} toggle={toggleAddPackageDrawer} />
    </Grid>
  );
};

export default PackagesList;
