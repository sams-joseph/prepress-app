import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import _ from 'lodash';

const styles = theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
  textField: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 100,
    maxWidth: 300,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class ReorderMetroItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      original: '',
      new: '',
      selectedParts: [],
      totalParts: [],
      isSaved: false,
      loading: false,
      errors: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.getParts = this.getParts.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.saveRow = this.saveRow.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  getParts(event) {
    this.setState({ selectedParts: [] });
    const jobNumber = event.target.value;

    if (jobNumber.length === 6) {
      this.setState({ loading: true });
      axios
        .get(`https://orders.mmt.com/api/?job=${jobNumber}&part=01&token=OsGHJd3Bxt`)
        .then((result) => {
          const {
            job,
          } = result.data;
          const parts = [];
          for (let i = 1; i <= job.totalParts; i += 1) {
            parts.push(i);
          }

          this.setState({ totalParts: parts, new: jobNumber, loading: false });
        })
        .catch(() => {
          this.setState({ totalParts: [], new: jobNumber, loading: false });
        });
    } else {
      this.setState({ totalParts: [], new: jobNumber, loading: false });
    }
  }

  handleChange(event) {
    this.setState({ selectedParts: event.target.value });
  }

  removeRow() {
    this.props.remove();
  }

  saveRow() {
    const errors = this.validate();
    if (_.isEmpty(errors)) {
      if (this.state.isSaved) {
        this.props.removeRow(this.props.byId);
      } else {
        this.props.save({
          original: this.state.original,
          new: this.state.new,
          selectedParts: this.state.selectedParts,
        }, this.props.byId);
      }

      this.setState({ isSaved: !this.state.isSaved });
    }
  }

  validate() {
    const { selectedParts, original } = this.state;
    const errors = {};
    if (this.state.new.length < 6) errors.new = 'Invalid Number';
    if (original.length < 6) errors.original = 'Invalid Number';
    if (selectedParts.length < 1) errors.selectedParts = 'No Parts Selected';

    this.setState({
      errors,
    });

    return errors;
  }

  render() {
    const { classes } = this.props;
    return (
      <ListItem className={classes.root}>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <form style={{ marginLeft: '20px' }}>
          <TextField
            id="original"
            placeholder="443098"
            label={this.state.errors.original ? this.state.errors.original : 'Original Order'}
            margin="dense"
            name="original"
            error={!!this.state.errors.original}
            disabled={this.state.isSaved}
            className={classes.textField}
            onChange={this.onChange}
          />
          <TextField
            id="new"
            placeholder="510123"
            label={this.state.errors.new ? this.state.errors.new : 'New Order'}
            error={!!this.state.errors.new}
            disabled={this.state.isSaved}
            margin="dense"
            onChange={this.getParts}
            className={classes.textField}
          />
          {this.state.loading ? (
            <CircularProgress className={classes.progress} size={30} />
          ) : (
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-multiple">Parts</InputLabel>
              <Select
                disabled={this.state.totalParts <= 0 || this.state.isSaved}
                error={!!this.state.errors.selectedParts}
                multiple
                value={this.state.selectedParts}
                onChange={this.handleChange}
                input={<Input id="select-multiple" />}
              >
                {this.state.totalParts.map(part => (
                  <MenuItem
                    key={part}
                    value={part}
                  >
                    {part}
                  </MenuItem>
                  ))}
              </Select>
            </FormControl>
            )}
        </form>
        <ListItemSecondaryAction>
          <IconButton aria-label="Save" onClick={this.saveRow} color={this.state.isSaved ? 'primary' : 'default'}>
            <SaveIcon />
          </IconButton>
          <IconButton aria-label="Delete" onClick={this.removeRow} disabled={this.state.isSaved}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

const { shape, func, number } = PropTypes;

ReorderMetroItem.propTypes = {
  classes: shape({}).isRequired,
  remove: func.isRequired,
  removeRow: func.isRequired,
  byId: number.isRequired,
  save: func.isRequired,
};

export default withStyles(styles)(ReorderMetroItem);
