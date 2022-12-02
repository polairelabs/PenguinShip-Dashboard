import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface TableHeaderProps {
  // value: number;
  toggle: () => void;
  toggleLabel: string;
  // handleFilter: (val: number) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  const { toggle, toggleLabel } = props;

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
      {/*<Button*/}
      {/*  sx={{ mr: 4, mb: 2 }}*/}
      {/*  color="secondary"*/}
      {/*  variant="outlined"*/}
      {/*  startIcon={<ExportVariant fontSize="small" />}*/}
      {/*>*/}
      {/*  Export*/}
      {/*</Button>*/}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
          {toggleLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;
