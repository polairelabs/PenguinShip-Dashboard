import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";

import { useDispatch, useSelector } from "react-redux";

import {
  clearDeleteStatus,
  deletePackage,
  fetchPackages
} from "src/store/apps/packages";

import { AppDispatch, RootState } from "src/store";
import { Package } from "src/types/apps/navashipInterfaces";

import TableHeader from "src/views/table/TableHeader";
import PackageModal from "../../../components/packages/packagesModal";
import { Box, Tooltip } from "@mui/material";
import toast from "react-hot-toast";

interface CellType {
  row: Package;
}

const PackagesList = () => {
  const store = useSelector((state: RootState) => state.packages);
  const [open, setOpen] = useState<boolean>(false);
  const [packageToEdit, setPackageToEdit] = useState<Package | undefined>(
    undefined
  );
  const [hoveredRow, setHoveredRow] = useState<Number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowCount, setRowCount] = useState(100);

  const totalCount = useSelector((state: RootState) => state.packages.total);

  const dispatch = useDispatch<AppDispatch>();

  const onMouseEnterRow = (event) => {
    const id = Number(event.currentTarget.getAttribute("data-id"));
    setHoveredRow(id);
  };

  const onMouseLeaveRow = (event) => {
    setHoveredRow(null);
  };

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
      field: "weight",
      headerName: "Weight (oz)",
      renderCell: ({ row }: CellType) => {
        return <Typography noWrap>{row.weight}</Typography>;
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
    // Called on mount as well
    dispatch(fetchPackages({ offset: currentPage, size: rowCount }));
  }, [currentPage, rowCount]);

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
            currentPage={currentPage}
            rowCount={rowCount}
          />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            disableSelectionOnClick
            pagination
            paginationMode="server"
            rowsPerPageOptions={[2, 50, 100]}
            rowCount={totalCount}
            onPageSizeChange={(count) => setRowCount(count)}
            onPageChange={(newPage) => setCurrentPage(newPage + 1)}
            disableColumnSelector
            componentsProps={{
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

export default PackagesList;
