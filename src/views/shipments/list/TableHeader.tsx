// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// ** Icons Imports
import ExportVariant from "mdi-material-ui/ExportVariant";

interface TableHeaderProps {
    value: number;
    toggle: () => void;
    handleFilter: (val: number) => void;
}

const TableHeader = (props: TableHeaderProps) => {
    // ** Props
    const { handleFilter, toggle, value } = props;

    return (
        <Box
            sx={{
                p: 5,
                pb: 3,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <Box
                sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
            >
                <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
                    Add Package
                </Button>
            </Box>
        </Box>
    );
};

export default TableHeader;
