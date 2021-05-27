import { Grid, Typography } from "@material-ui/core";
// this component to create Global Card
const GlobalCard = (props) => {
  return (
    <Grid container className="mb globalReportCard">
      <Grid item xs={12} className={`globalReportTitle ${props.titleClass}`}>
        <Typography variant="h5" component="h2">
          {props.title}
        </Typography>
      </Grid>
      <Grid
        container
        className={`globalReportValue ${props.contentClass}`}
        justify="center"
        alignItems="center"
      >
        <Typography variant="h5">{props.data}</Typography>
      </Grid>
    </Grid>
  );
};

export default GlobalCard;
