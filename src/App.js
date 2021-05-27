import { useState, useEffect } from "react";
import "./App.css";
import { Container, Grid, Typography, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import "@fontsource/roboto";
import LoadingPage from "./components/LoadingPage";
import GlobalCard from "./components/GlobalCard";
import CustomTable from "./components/CustomTable";
import globalFunc from "./reuseFuction";

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
    switch (click) {
      case 1:
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
        break;
      case 2:
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
        break;
      case 3:
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
        break;
      default:
        break;
    }
    sortCovidData(tempState);
  };

  // sort
  const sortCovidData = (temp) => {
    switch (temp) {
      case 1:
        filterCovidData.sort((a, b) => {
          return a.TotalConfirmed > b.TotalConfirmed ? 1 : -1;
        });
        break;

      case 2:
        filterCovidData.sort((a, b) => {
          return a.TotalConfirmed < b.TotalConfirmed ? 1 : -1;
        });
        break;

      case 3:
        filterCovidData.sort((a, b) => {
          return a.TotalRecovered > b.TotalRecovered ? 1 : -1;
        });
        break;

      case 4:
        filterCovidData.sort((a, b) => {
          return a.TotalRecovered < b.TotalRecovered ? 1 : -1;
        });
        break;

      case 5:
        filterCovidData.sort((a, b) => {
          return a.TotalDeaths > b.TotalDeaths ? 1 : -1;
        });
        break;

      case 6:
        filterCovidData.sort((a, b) => {
          return a.TotalDeaths < b.TotalDeaths ? 1 : -1;
        });
        break;

      default:
        break;
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
                    data={globalFunc.numberWithCommas(
                      covidData.Global.TotalConfirmed
                    )}
                    titleClass="Confirmed"
                    contentClass="confirmContent"
                  />
                </Grid>
                <Grid item xl={2} md={3} xs={12} sm={7}>
                  <GlobalCard
                    title="Total Recover"
                    data={globalFunc.numberWithCommas(
                      covidData.Global.TotalRecovered
                    )}
                    titleClass="Recover"
                    contentClass="recoverContent"
                  />
                </Grid>
                <Grid item xl={2} md={3} xs={12} sm={7}>
                  <GlobalCard
                    title="Total Deaths"
                    data={globalFunc.numberWithCommas(
                      covidData.Global.TotalDeaths
                    )}
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

export default App;
