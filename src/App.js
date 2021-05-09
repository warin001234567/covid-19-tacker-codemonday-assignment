import { useState, useEffect } from "react";
import "./App.css";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  TableContainer,
  ButtonBase,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import "@fontsource/roboto";
import LoadingPage from "./components/LoadingPage";
import ArrowUp from "./arrow-up.png";
import ArrowDown from "./arrow-down.png";

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
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [sortState, setSortState] = useState(0);
  const [searchText, setSearchText] = useState("");

  // fetch Data from Api
  const fetchData = () => {
    const apiUrl = "https://api.covid19api.com/summary";
    axios.get(apiUrl).then((res) => {
      handleDataCompelete(res.data.Countries);
      setCovidData(res.data);
      setFilterCovidData(res.data.Countries);
      setLoading(false);
    });
  };

  // handle click sort
  const handleOnClickSort = (click) => {
    let tempState;

    if (click === 1) {
      if (sortState === 1) {
        setSortState(2);
        tempState = 2;
      } else if (sortState === 2) {
        setSortState(0);
        tempState = 0;
      } else if (sortState !== 1) {
        setSortState(1);
        tempState = 1;
      }
    } else if (click === 2) {
      if (sortState === 3) {
        setSortState(4);
        tempState = 4;
      } else if (sortState === 4) {
        setSortState(0);
        tempState = 0;
      } else if (sortState !== 3) {
        setSortState(3);
        tempState = 3;
      }
    } else if (click === 3) {
      if (sortState === 5) {
        setSortState(6);
        tempState = 6;
      } else if (sortState === 6) {
        setSortState(0);
        tempState = 0;
      } else if (sortState !== 5) {
        setSortState(5);
        tempState = 5;
      }
    }
    sortCovidData(tempState);
  };

  // sort
  const sortCovidData = (temp) => {
    if (temp === 1) {
      filterCovidData.sort((a, b) => {
        return a.TotalConfirmed > b.TotalConfirmed ? 1 : -1;
      });
    } else if (temp === 2) {
      filterCovidData.sort((a, b) => {
        return a.TotalConfirmed < b.TotalConfirmed ? 1 : -1;
      });
    } else if (temp === 3) {
      filterCovidData.sort((a, b) => {
        return a.TotalRecovered > b.TotalRecovered ? 1 : -1;
      });
    } else if (temp === 4) {
      filterCovidData.sort((a, b) => {
        return a.TotalRecovered < b.TotalRecovered ? 1 : -1;
      });
    } else if (temp === 5) {
      filterCovidData.sort((a, b) => {
        return a.TotalDeaths > b.TotalDeaths ? 1 : -1;
      });
    } else if (temp === 6) {
      filterCovidData.sort((a, b) => {
        return a.TotalDeaths < b.TotalDeaths ? 1 : -1;
      });
    }
  };

  // create data to autocompelete
  const handleDataCompelete = (data) => {
    let result = data.map((item) => item.Country);
    setAutocompelete(result);
  };

  // filter data when autocompelete change and set to state
  const handleAutocompeleteChange = (value) => {
    let result = covidData.Countries.filter((item) => {
      let temp = item.Country.toLowerCase();
      return temp.includes(value.toLowerCase());
    });
    setFilterCovidData(result);
  };

  // handle Table page change
  const handleChangeTablePage = (e, page) => {
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
    setWindowDimensions(getWindowDimensions());
  }, [getWindowDimensions().width]);

  // useEffect(() => {
  //   sortCovidData();
  // }, [sortState]);

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
            <Grid className="navbar" item xs={12}>
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
                handleAutocompeleteChange(v);
              }}
              autoComplete
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Country"
                  variant="outlined"
                />
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
                sortState={sortState}
                click={handleOnClickSort}
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
              <ButtonBase disableRipple onClick={() => props.click(1)}>
                <Typography variant="subtitle2">
                  Total Confirmed{" "}
                  {props.sortState === 1 ? (
                    <img className="arrowSize" src={ArrowDown} />
                  ) : props.sortState === 2 ? (
                    <img className="arrowSize" src={ArrowUp} />
                  ) : (
                    ""
                  )}
                </Typography>
              </ButtonBase>
            </TableCell>
            <TableCell>
              <ButtonBase disableRipple onClick={() => props.click(2)}>
                <Typography variant="subtitle2">
                  Total Recovered{" "}
                  {props.sortState === 3 ? (
                    <img className="arrowSize" src={ArrowDown} />
                  ) : props.sortState === 4 ? (
                    <img className="arrowSize" src={ArrowUp} />
                  ) : (
                    ""
                  )}
                </Typography>
              </ButtonBase>
            </TableCell>
            <TableCell>
              <ButtonBase disableRipple onClick={() => props.click(3)}>
                <Typography variant="subtitle2">
                  Total Deaths{" "}
                  {props.sortState === 5 ? (
                    <img className="arrowSize" src={ArrowDown} />
                  ) : props.sortState === 6 ? (
                    <img className="arrowSize" src={ArrowUp} />
                  ) : (
                    ""
                  )}
                </Typography>
              </ButtonBase>
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
