import { useState, useEffect, MouseEvent, useCallback } from "react";

import Link from "next/link";

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

import { RootState, AppDispatch } from "src/store";
import { Package } from "src/types/apps/navashipInterfaces";

import TableHeader from "src/views/packages/list/TableHeader";
import PackageModal from "../../../components/packages/packagesModal";

interface CellType {
  row: Package;
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
    minWidth: 250,
    field: "name",
    headerName: "Name",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap>
          {row.name}
        </Typography>
      );
    }
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "value",
    headerName: "Value ($)",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap>
          {row.value}
        </Typography>
      );
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: "weight",
    headerName: "Weight (oz)",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap>
          {row.weight}
        </Typography>
      );
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "length",
    headerName: "Length (in)",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{
          color: "text.secondary",
        }}>
          {row.length}
        </Typography>
      );
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "width",
    headerName: "Width (in)",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{
          color: "text.secondary",
        }}>
          {row.width}
        </Typography>
      );
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "height",
    headerName: "Height (in)",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{
          color: "text.secondary",
        }}>
          {row.height}
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
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

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
    </Grid>
  );
};

export default PackagesList;
