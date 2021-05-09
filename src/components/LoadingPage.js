import { Grid } from "@material-ui/core";
import "../App.css";
import { ScaleLoader } from "react-spinners";

const LoadingPage = (prop) => {
  return (
    <Grid className="fullScreen" container justify="center" alignItems="center">
      <ScaleLoader
        color={"#fb3640"}
        height={90}
        width={9}
        radius={4.5}
        margin={4.5}
      />
    </Grid>
  );
};

export default LoadingPage;
