// ** React Imports
import {
  useState,
  useEffect,
  MouseEvent,
  useCallback,
  ReactElement
} from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Select, { SelectChangeEvent } from "@mui/material/Select";

// ** Icons Imports
import Laptop from "mdi-material-ui/Laptop";
import ChartDonut from "mdi-material-ui/ChartDonut";
import CogOutline from "mdi-material-ui/CogOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import DotsVertical from "mdi-material-ui/DotsVertical";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import { fetchAddresses } from "src/store/apps/addresses";

// ** Types Imports
import { RootState, AppDispatch } from "src/store";
import { ThemeColor } from "src/@core/layouts/types";
import { AddressesType, PackagesType } from "src/types/apps/userTypes";

// ** Custom Components Imports
import AddressModal from "src/views/addresses/list/AddressModal";

interface UserRoleType {
  [key: string]: ReactElement;
}

interface CellType {
  row: AddressesType;
}

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary
}));

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    //dispatch(deletePackages(id));
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
    minWidth: 230,
    field: "name",
    headerName: "Name",
    renderCell: ({ row }: CellType) => {
      const { id, name, street1 } = row;

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
    field: "street1",
    headerName: "Street 1",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant="body2">
          {row.street1}
        </Typography>
      );
    }
  },
  {
    flex: 0.15,
    field: "street2",
    minWidth: 150,
    headerName: "Street 2",
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
            {row.street2}
          </Typography>
        </Box>
      );
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "City",
    field: "city",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ textTransform: "capitalize" }}>
          {row.city}
        </Typography>
      );
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "postalCode",
    headerName: "Zip Code",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ textTransform: "capitalize" }}>
          {row.zip}
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

const AddressesList = () => {
  // ** State

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.addresses);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const data = () => {
    console.log("STORE DATA", store.data);
    if (store.data) {
      return store.data;
    }
    return "";
  };

  return (
    // <p>{data()}</p>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <AddressModal />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default AddressesList;
