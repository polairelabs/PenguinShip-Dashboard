import { useContext, useEffect, useState } from "react";

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
  fetchPackages,
  setOffset,
  setSize
} from "src/store/apps/packages";

import { AppDispatch, RootState } from "src/store";
import { Package } from "src/types/apps/NavashipTypes";

import TableHeader from "src/views/table/TableHeader";
import PackageModal from "../../../components/packages/packagesModal";
import { Box, Tooltip } from "@mui/material";
import toast from "react-hot-toast";
import { Delete, Pencil } from "mdi-material-ui";
import { AbilityContext } from "../../../layouts/components/acl/Can";

interface CellType {
  row: Package;
}

const PackagesList = () => {
  const ability = useContext(AbilityContext);
  const enableUpdateButton = ability?.can("update", "entity");
  const enableDeleteButton = ability?.can("delete", "entity");

  const store = useSelector((state: RootState) => state.packages);
  const [open, setOpen] = useState<boolean>(false);
  const [packageToEdit, setPackageToEdit] = useState<Package | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    const storedPageSize = localStorage.getItem("packagesDataGridSize");
    return storedPageSize ? Number(storedPageSize) : 20;
  });

  const totalCount = useSelector((state: RootState) => state.packages.total);

  const dispatch = useDispatch<AppDispatch>();

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
            <Tooltip title="Edit" disableInteractive={true}>
              <IconButton
                disabled={!enableUpdateButton}
                onClick={() => handleUpdate(row)}
              >
                <Pencil />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" disableInteractive={true}>
              <IconButton
                disabled={!enableDeleteButton}
                onClick={() => handleDelete(row.id)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  useEffect(() => {
    // Called when first mounted as well
    dispatch(
      fetchPackages({ offset: currentPage, size: pageSize, order: "desc" })
    );
    dispatch(setOffset(currentPage));
    dispatch(setSize(pageSize));
  }, [currentPage, pageSize]);

  // Delete toast
  useEffect(() => {
    if (store.deleteStatus === "SUCCESS") {
      toast.success("Parcel was successfully deleted", {
        position: "top-center"
      });
    } else if (store.deleteStatus === "ERROR") {
      toast.error("Error deleting parcel", {
        position: "top-center"
      });
    }
    dispatch(clearDeleteStatus());
  }, [store.deleteStatus]);

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    window.localStorage.setItem("packagesDataGridSize", size.toString());
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
            disableSelectionOnClick
            pagination
            paginationMode="server"
            rowsPerPageOptions={[20, 50, 100]}
            pageSize={pageSize}
            rowCount={totalCount}
            onPageSizeChange={(count) => onPageSizeChange(count)}
            onPageChange={(newPage) => setCurrentPage(newPage + 1)}
            disableColumnSelector
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
