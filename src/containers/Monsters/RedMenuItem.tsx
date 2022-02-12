import { MenuItem } from "@mui/material";
import { withStyles, createStyles } from "@mui/styles";

const styles = () =>
  createStyles({
    root: {
      "&$selected": {
        backgroundColor: "#47010b !important",
        "&:hover": {
          backgroundColor: "#50010b !important",
        },
      },
      "&:hover": {
        backgroundColor: "#40010b !important",
      },
    },
    selected: {},
  });

export default withStyles(styles)(MenuItem);
