import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
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
import PlayIcon from '@material-ui/icons/PlayArrow';
import CheckIcon from '@material-ui/icons/CheckCircle';
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

class ResetItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new: '',
      selectedParts: [],
      totalParts: [],
      isSaved: false,
      loading: false,
      processing: false,
      errors: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDirectory = this.handleChangeDirectory.bind(this);
    this.getParts = this.getParts.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.saveRow = this.saveRow.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('reset-order', () => {
      setTimeout(() => {
        this.setState({
          processing: false,
        });
      }, 3000);
    });
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
        .catch((err) => {
          this.setState({ totalParts: [], new: jobNumber, loading: false });
        });
    } else {
      this.setState({ totalParts: [], new: jobNumber, loading: false });
    }
  }

  handleChange(event) {
    this.setState({ selectedParts: event.target.value });
  }

  handleChangeDirectory(event) {
    this.setState({ directory: event.target.value });
  }

  removeRow() {
    this.props.remove();
  }

  saveRow() {
    const errors = this.validate();
    this.setState({ processing: true });
    if (_.isEmpty(errors)) {
      ipcRenderer.send('reset-order', { new: this.state.new, selectedParts: this.state.selectedParts });
      this.setState({ isSaved: !this.state.isSaved });
    }
  }

  validate() {
    const { selectedParts } = this.state;
    const errors = {};
    if (this.state.new.length < 6) errors.new = 'Invalid Number';
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
            id="new"
            placeholder="510123"
            label={this.state.errors.new ? this.state.errors.new : 'Order'}
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
          {this.state.processing ? (
            <CircularProgress className={classes.progress} size={30} />
          ) : (
            <IconButton aria-label="Save" onClick={this.saveRow} disabled={this.state.isSaved}>
                {this.state.isSaved ? (
                  <CheckIcon />
                ) : (
                  <PlayIcon />
                  )}
              </IconButton>
            )}
          <IconButton aria-label="Delete" onClick={this.removeRow}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

ResetItem.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ResetItem);
