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

import { clearDeleteStatus, deletePackage, fetchPackages } from "src/store/apps/packages";

import { AppDispatch, RootState } from "src/store";
import { Package } from "src/types/apps/navashipInterfaces";

import TableHeader from "src/views/packages/list/TableHeader";
import PackageModal from "../../../components/packages/packagesModal";
import { Box, Tooltip } from "@mui/material";
import toast from "react-hot-toast";

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

const PackagesList = () => {
  const [value, setValue] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [packageToEdit, setPackageToEdit] = useState<Package | undefined>(undefined);

  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.packages);

  const [hoveredRow, setHoveredRow] = useState<Number | null>(null);

  const onMouseEnterRow = (event) => {
    const id = Number(event.currentTarget.getAttribute("data-id"));
    setHoveredRow(id);
  };

  const onMouseLeaveRow = (event) => {
    setHoveredRow(null);
  };

  const columns = [
    {
      flex: 0.5,
      field: "name",
      headerName: "Name",
      renderCell: ({ row }: CellType) => {
        return <Typography noWrap>{row.name}</Typography>;
      }
    },
    {
      flex: 0.2,
      field: "value",
      headerName: "Value ($)",
      renderCell: ({ row }: CellType) => {
        return <Typography noWrap>{row.value}</Typography>;
      }
    },
    {
      flex: 0.2,
      field: "weight",
      headerName: "Weight (oz)",
      renderCell: ({ row }: CellType) => {
        return <Typography noWrap>{row.weight}</Typography>;
      }
    },
    {
      flex: 0.2,
      field: "length",
      headerName: "Length (in)",
      renderCell: ({ row }: CellType) => {
        return (
          <Typography
            noWrap
            sx={{
              color: "text.secondary"
            }}
          >
            {row.length}
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      field: "width",
      headerName: "Width (in)",
      renderCell: ({ row }: CellType) => {
        return (
          <Typography
            noWrap
            sx={{
              color: "text.secondary"
            }}
          >
            {row.width}
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      field: "height",
      headerName: "Height (in)",
      renderCell: ({ row }: CellType) => {
        return (
          <Typography
            noWrap
            sx={{
              color: "text.secondary"
            }}
          >
            {row.height}
          </Typography>
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
              <Tooltip title="Edit">
                <IconButton onClick={() => handleUpdate(row)}>
                  <PencilOutline />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(row.id)}>
                  <DeleteOutline />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } else return null;
      }
    }
  ];

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  // Delete toast
  useEffect(() => {
    if (store.deleteStatus === "SUCCESS") {
      toast.success("Package was successfully deleted", {
        position: "top-center"
      });
    } else if (store.deleteStatus === "ERROR") {
      toast.error("Error deleting package", {
        position: "top-center"
      });
    }
    dispatch(clearDeleteStatus());
  }, [store.deleteStatus]);

  const handleDialogToggle = () => {
    setOpen(!open);
    setPackageToEdit(undefined);
  };

  const handleUpdate = (parcel: Package) => {
    setPackageToEdit(parcel);
    setOpen(!open);
  };

  const handleDelete = (id) => {
    dispatch(deletePackage(id));
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            toggle={handleDialogToggle}
            toggleLabel="Create parcel"
          />
          <PackageModal
            open={open}
            handleDialogToggle={handleDialogToggle}
            packageToEdit={packageToEdit}
          />

          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            pageSize={value}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setValue(newPageSize)}
            disableColumnSelector
            componentsProps={{
              row: {
                onMouseEnter: onMouseEnterRow,
                onMouseLeave: onMouseLeaveRow
              }
            }}
            sx={{
              "& .MuiDataGrid-columnHeadersInner .MuiDataGrid-columnHeader:nth-last-child(2) .MuiDataGrid-columnSeparator":
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

export default PackagesList;
