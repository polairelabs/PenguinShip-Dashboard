import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";

interface TableHeaderProps {
  toggle: () => void;
  toggleLabel: string;
  informationAlertMessage?: string;
}

const TableHeader = (props: TableHeaderProps) => {
  const { toggle, toggleLabel, informationAlertMessage } = props;

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
      {informationAlertMessage && (
        <Alert sx={{ mb: 2 }} severity="info">
          {informationAlertMessage}
        </Alert>
      )}
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
