import { useState, useEffect } from "react";
import "./App.css";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  TableContainer,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import "@fontsource/roboto";
import LoadingPage from "./components/LoadingPage";

// Add comma to number
const numberWithCommas = (x) => {
  if (x !== 0) return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "unreported";
};

// get window height and width
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

// Main Page
function App() {
  const [covidData, setCovidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tablePage, setTablePage] = useState(0);
  const [tableRowPerPages, setTabalRowPerPages] = useState(10);
  const [autoCompelete, setAutocompelete] = useState(null);
  const [filterCovidData, setFilterCovidData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  // fetch Data from Api
  const fetchData = () => {
    const apiUrl = "https://api.covid19api.com/summary";
    axios.get(apiUrl).then((res) => {
      console.log(res.data);
      handleDataCompelete(res.data.Countries);
      setCovidData(res.data);
      setFilterCovidData(res.data.Countries);
      setLoading(false);
    });
  };

  // create data to autocompelete
  const handleDataCompelete = (data) => {
    let result = data.map((item) => item.Country);
    setAutocompelete(result);
  };

  // filter data when autocompelete change and set to state
  const handleAutocompeleteChange = (value) => {
    console.log(value);
    let result = covidData.Countries.filter((item) => {
      let temp = item.Country.toLowerCase();
      return temp.includes(value.toLowerCase());
    });
    setFilterCovidData(result);
    setSearchText(value);
  };

  // handle Table page change
  const handleChangeTablePage = (e, page) => {
    console.log("tablePage", tablePage);
    setTablePage(page);
  };

  // handle rowPerpage change
  const handleRowPerPageChange = (e) => {
    setTabalRowPerPages(parseInt(e.target.value, 10));
    setTablePage(0);
  };

  // format datetime to easy to read
  const handleDateTime = (date) => {
    const reCreated = new Date(date);
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(reCreated);
  };

  useEffect(() => {
    // console.log(getWindowDimensions().width);
    setWindowDimensions(getWindowDimensions());
  }, [getWindowDimensions().width]);

  useEffect(() => {
    fetchData();

    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Container maxWidth={false} disableGutters={true} className="App">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          {/* Hero Section */}
          <Grid container>
            <Grid item xs={12}>
              <Grid container className="pl pt pb" justify="flex-start">
                <Typography variant="h5">COVID-19 TRACKER</Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justify="center"
              alignItems="center"
              className="hero"
            >
              <Grid className="mt" item xs={12}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  className="mt mb pl pr"
                >
                  <Typography variant="h4">Global Report</Typography>
                  <Typography variant="subtitle2">
                    Infomation update on : {handleDateTime(covidData.Date)}
                  </Typography>
                </Grid>
              </Grid>
              {/* <Grid className="mt" item xs={12}>
              <div className="mt">
                <Typography variant="subtitle2">
                  data update on : {handleDateTime(covidData.Date)}
                </Typography>
              </div>
            </Grid> */}
              <Grid container className="pr pl" justify="space-evenly">
                <Grid item xl={2} md={3} xs={12} sm={7}>
                  <GlobalCard
                    title="Total Confirmed"
                    data={numberWithCommas(covidData.Global.TotalConfirmed)}
                    titleClass="Confirmed"
                    contentClass="confirmContent"
                  />
                </Grid>
                <Grid item xl={2} md={3} xs={12} sm={7}>
                  <GlobalCard
                    title="Total Recover"
                    data={numberWithCommas(covidData.Global.TotalRecovered)}
                    titleClass="Recover"
                    contentClass="recoverContent"
                  />
                </Grid>
                <Grid item xl={2} md={3} xs={12} sm={7}>
                  <GlobalCard
                    title="Total Deaths"
                    data={numberWithCommas(covidData.Global.TotalDeaths)}
                    titleClass="Deaths"
                    contentClass="deathContent"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Search Country Section */}
          <Grid
            container
            className="searchWapper"
            justify="center"
            alignItems="center"
          >
            <Autocomplete
              freeSolo
              options={autoCompelete}
              style={{ width: 300 }}
              getOptionLabel={(option) => option}
              onInputChange={(e, v, r) => {
                console.log("onInputChange++++++++++++++++");
                handleAutocompeleteChange(v);
              }}
              autoComplete
              renderInput={(params) => (
                <TextField {...params} label="Combo box" variant="outlined" />
              )}
            />
          </Grid>
          {/* Table Section */}
          <Grid
            className={
              windowDimensions.width > 620
                ? "tableSectionBig"
                : "tableSectionSmall"
            }
            container
            justify="center"
            alignItems="center"
          >
            <Grid className={windowDimensions.width > 620 ? "border" : ""}>
              <CustomTable
                data={filterCovidData}
                page={tablePage}
                onChangePage={handleChangeTablePage}
                rowsPerPage={tableRowPerPages}
                onChangeRowsPerPage={handleRowPerPageChange}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}

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

// this component create custom table
const CustomTable = (props) => {
  return (
    <TableContainer style={{ width: "100%" }}>
      <Table>
        {/* Head Part */}
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">Country</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Total Confirmed</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Total Recovered</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Total Deaths</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        {/* Body Part */}
        <TableBody>
          {(props.rowsPerPage > 0
            ? props.data.slice(
                props.page * props.rowsPerPage,
                props.page * props.rowsPerPage + props.rowsPerPage
              )
            : props.data
          ).map((item) => (
            <TableRow key={item.ID}>
              <TableCell>{item.Country}</TableCell>
              <TableCell>{numberWithCommas(item.TotalConfirmed)}</TableCell>
              <TableCell>{numberWithCommas(item.TotalRecovered)}</TableCell>
              <TableCell>{numberWithCommas(item.TotalDeaths)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPage={props.rowsPerPage}
              rowsPerPageOptions={[10, 20, 50, 100]}
              onChangeRowsPerPage={props.onChangeRowsPerPage}
              page={props.page}
              count={props.data.length}
              onChangePage={(e, page) => props.onChangePage(e, page)}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default App;
