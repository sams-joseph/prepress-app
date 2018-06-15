import React from 'react';
import { shell } from 'electron';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import moment from 'moment';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  constructor(props) {
    super(props);

    this.handleFirstPageButtonClick = this.handleFirstPageButtonClick.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
    this.handleLastPageButtonClick = this.handleLastPageButtonClick.bind(this);
  }

  handleFirstPageButtonClick(event) {
    this.props.onChangePage(event, 0);
  }

  handleBackButtonClick(event) {
    this.props.onChangePage(event, this.props.page - 1);
  }

  handleNextButtonClick(event) {
    this.props.onChangePage(event, this.props.page + 1);
  }

  handleLastPageButtonClick(event) {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  }

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.shape({}).isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

function clickOrder(e, link) {
  e.preventDefault();
  shell.openExternal(link);
}

function createLinkOrderPart(num) {
  const order = num.substring(0, 6);
  const part = num.substring(7, 9);
  return num.length === 9 ? (
    <a style={{ textDecoration: 'none', color: '#039be5' }} href="" onClick={e => clickOrder(e, `https://epace.mmt.com/epace/company:public/object/JobPart/detail/${order}%3A${part}`)}>{num}</a>
  ) : (
    num
  );
}

function createLinkOrder(num) {
  return (
    <a style={{ textDecoration: 'none', color: '#039be5' }} href="" onClick={e => clickOrder(e, `https://epace.mmt.com/epace/company:public/object/Job/detail/${num}`)}>{num}</a>
  );
}

const pad = (num) => {
  let s = String(num);
  while (s.length < 2) { s = `0${s}`; }
  return s;
};


function createLinkPart(order, part) {
  return (
    <a style={{ textDecoration: 'none', color: '#039be5' }} href="" onClick={e => clickOrder(e, `https://epace.mmt.com/epace/company:public/object/JobPart/detail/${order}%3A${pad(part)}`)}>{part}</a>
  );
}

let counter = 0;
function createData(original, newOrder, selectedParts, created) {
  counter += 1;
  const tempParts = [];
  selectedParts.forEach((part) => {
    tempParts.push(createLinkPart(newOrder, part));
  });
  const parts = tempParts.reduce((prev, curr) => [prev, ', ', curr]);
  const date = moment(created).format('h:mm A MMM DD YYYY');
  return { counter, date, original: createLinkOrderPart(original), newOrder: createLinkOrder(newOrder), parts };
}

let resetCounter = 0;
function createDataReset(order, selectedParts, created) {
  resetCounter += 1;
  const parts = selectedParts.join(', ');
  const date = moment(created).format('h:mm A MMM DD YYYY');
  return { resetCounter, date, original: order, parts };
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: '0',
  },
  table: {
    minWidth: 500,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#F3F5F7',
    },
  },
  tableWrapper: {
    overflow: 'auto',
  },
});

class PaginatedTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 5,
    };

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  handleChangePage(event, page) {
    this.setState({ page });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: event.target.value });
  }

  render() {
    const { classes, orders, table } = this.props;
    const { rowsPerPage, page } = this.state;
    let data = {};
    if (table === 0) {
      data = orders.map(order => (
        createData(order._doc.original, order._doc.new, order._doc.parts, order._doc.created)
      )).sort((a, b) => (a.counter > b.counter ? -1 : 1));
    } else {
      data = orders.map(order => (
        createDataReset(order._doc.order, order._doc.parts, order._doc.created)
      )).sort((a, b) => (a.counter > b.counter ? -1 : 1));
    }
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root} elevation={0}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              {table === 0 ? (
                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell numeric>Original Order</TableCell>
                  <TableCell numeric>New Order</TableCell>
                  <TableCell numeric>Selected Parts</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell numeric>Order</TableCell>
                  <TableCell numeric>Selected Parts</TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => (
                <TableRow key={n.counter} className={classes.row}>
                  <TableCell>{n.date}</TableCell>
                  <TableCell numeric component="th" scope="row">
                    {n.original}
                  </TableCell>
                  {table === 0 &&
                    <TableCell numeric>{n.newOrder}</TableCell>
                  }
                  <TableCell numeric>{n.parts}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={4}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

PaginatedTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  orders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default withStyles(styles)(PaginatedTable);
