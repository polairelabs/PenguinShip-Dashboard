import { useContext, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { useDispatch, useSelector } from "react-redux";

import {
  clearDeleteStatus,
  deleteAddress,
  fetchAddresses,
  setOffset,
  setSize
} from "src/store/apps/addresses";

import { AppDispatch, RootState } from "src/store";
import { Address } from "src/types/apps/NavashipTypes";

import AddressModal from "src/components/addresses/addressModal";
import TableHeader from "../../../views/table/TableHeader";
import { Tooltip } from "@mui/material";
import toast from "react-hot-toast";
import CustomChip from "../../../@core/components/mui/chip";
import { Delete, Pencil } from "mdi-material-ui";
import { AbilityContext } from "../../../layouts/components/acl/Can";

interface CellType {
  row: Address;
}

const AddressesList = () => {
  const ability = useContext(AbilityContext);
  const enableUpdateButton = ability?.can("update", "entity");
  const enableDeleteButton = ability?.can("delete", "entity");

  const store = useSelector((state: RootState) => state.addresses);
  const [open, setOpen] = useState<boolean>(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    const storedPageSize = localStorage.getItem("addressesDataGridSize");
    return storedPageSize ? Number(storedPageSize) : 20;
  });

  const totalCount = useSelector((state: RootState) => state.addresses.total);

  const dispatch = useDispatch<AppDispatch>();

  const handleDialogToggle = () => {
    setOpen(!open);
    setAddressToEdit(undefined);
  };

  const handleUpdate = (address: Address) => {
    setAddressToEdit(address);
    setOpen(!open);
  };

  const handleDelete = (id) => {
    dispatch(deleteAddress(id));
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
      field: "type",
      headerName: "Type",
      renderCell: ({ row }: CellType) => {
        const typeColor = row.residential ? "info" : "success";
        const type = row.residential ? "Home" : "office";

        return (
          <CustomChip
            size="small"
            skin="light"
            color={typeColor}
            label={type}
            sx={{ "& .MuiChip-label": { textTransform: "capitalize" } }}
          />
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
            <Tooltip title="Edit">
              <IconButton
                disabled={!enableUpdateButton}
                onClick={() => handleUpdate(row)}
              >
                <Pencil />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
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
      fetchAddresses({ offset: currentPage, size: pageSize, order: "desc" })
    );
    dispatch(setOffset(currentPage));
    dispatch(setSize(pageSize));
  }, [currentPage, pageSize]);

  // Delete toast
  useEffect(() => {
    if (store.deleteStatus === "SUCCESS") {
      toast.success("Address was successfully deleted", {
        position: "top-center"
      });
    } else if (store.deleteStatus === "ERROR") {
      toast.error("Error deleting address", {
        position: "top-center"
      });
    }
    dispatch(clearDeleteStatus());
  }, [store.deleteStatus]);

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    window.localStorage.setItem("addressesDataGridSize", size.toString());
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
            addressToEdit={addressToEdit}
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

export default AddressesList;
