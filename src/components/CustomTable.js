import {
  Typography,
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
import ArrowUp from "../arrow-up.png";
import ArrowDown from "../arrow-down.png";
import ArrowUpDown from "../up-and-down.png";
import globalFunc from "../reuseFuction";
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
                    <img className="arrowSize" src={ArrowUpDown} />
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
                    <img className="arrowSize" src={ArrowUpDown} />
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
                    <img className="arrowSize" src={ArrowUpDown} />
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
              <TableCell>
                {globalFunc.numberWithCommas(item.TotalConfirmed)}
              </TableCell>
              <TableCell>
                {globalFunc.numberWithCommas(item.TotalRecovered)}
              </TableCell>
              <TableCell>
                {globalFunc.numberWithCommas(item.TotalDeaths)}
              </TableCell>
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

export default CustomTable;
