import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData(original, newOrder, selectedParts) {
  id += 1;
  const parts = selectedParts.join(', ');
  return { id, original, newOrder, parts };
}

function SimpleTable(props) {
  const { classes, orders } = props;
  const data = orders.map(order => (
    createData(order.original, order.new, order.selectedParts)
  ));

  return (
    <Paper className={classes.root} elevation={0}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Original Order</TableCell>
            <TableCell numeric>New Order</TableCell>
            <TableCell numeric>Selected Parts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => (
            <TableRow key={n.id}>
              <TableCell component="th" scope="row">
                {n.original}
              </TableCell>
              <TableCell numeric>{n.newOrder}</TableCell>
              <TableCell numeric>{n.parts}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(SimpleTable);
