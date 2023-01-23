import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface TableHeaderProps {
  toggle: () => void;
  toggleLabel: string;
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          marginLeft: "auto"
        }}
      >
        <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
          {toggleLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;
