import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PrinterIcon from '@material-ui/icons/Print';
import KeylineIcon from '@material-ui/icons/CropOriginal';
import UploadIcon from '@material-ui/icons/CloudUpload';
import green from '@material-ui/core/colors/green';
import pm2 from 'pm2';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  appFrame: {
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    background: '#37474F',
  },
  'appBar-left': {
    marginLeft: drawerWidth,
  },
  'appBar-right': {
    marginRight: drawerWidth,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  greenAvatar: {
    backgroundColor: green.A700,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  button: {
    margin: theme.spacing.unit,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class FolderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      epson: false,
      keyline: false,
      cco: false,
      upload: false,
    };

    this.startProcesses = this.startProcesses.bind(this);
    this.toggleCCO = this.toggleCCO.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
  }

  componentDidMount() {
    pm2.describe('epson', (err, processDescription) => {
      if (processDescription[0].pm2_env.status === 'online') {
        this.setState({
          epson: true,
          init: true,
        });
      }
    });

    pm2.describe('keyline', (err, processDescription) => {
      if (processDescription[0].pm2_env.status === 'online') {
        this.setState({
          keyline: true,
        });
      }
    });

    pm2.describe('cco', (err, processDescription) => {
      if (processDescription[0].pm2_env.status === 'online') {
        this.setState({
          cco: true,
        });
      }
    });

    pm2.describe('upload', (err, processDescription) => {
      if (processDescription[0].pm2_env.status === 'online') {
        this.setState({
          upload: true,
        });
      }
    });
  }

  startProcesses() {
    ipcRenderer.send('initialize', 'start');
    this.setState({
      init: true,
      epson: true,
      keyline: true,
    });
  }

  toggleCCO() {
    if (this.state.cco) {
      ipcRenderer.send('toggle-cco', 'stop');
    } else {
      ipcRenderer.send('toggle-cco', 'start');
    }
    this.setState({
      cco: !this.state.cco,
    });
  }

  toggleUpload() {
    if (this.state.upload) {
      ipcRenderer.send('toggle-upload', 'stop');
    } else {
      ipcRenderer.send('toggle-upload', 'start');
    }
    this.setState({
      upload: !this.state.upload,
    });
  }

  render() {
    const { classes } = this.props;
    const { init, epson, cco, keyline, upload } = this.state;
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        {
          init ? (
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
            >
              Running
            </Button>
          ) : (
            <Button
                variant="raised"
                color="primary"
                className={classes.button}
                onClick={this.startProcesses}
              >
                Start
              </Button>
            )
        }
        <Divider />
        <List dense>
          <ListItem>
            <Typography variant="caption" color="textSecondary" noWrap>
              PROCESSES
            </Typography>
          </ListItem>
          <ListItem button>
            <Avatar className={epson ? classes.greenAvatar : ''}>
              <PrinterIcon />
            </Avatar>
            <ListItemText primary="Epson" />
            <ListItemSecondaryAction>
              <Typography variant="caption" color={epson ? 'secondary' : 'textSecondary'} noWrap style={{ marginRight: '20px' }}>
                {epson ? 'Online' : 'Offline'}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button>
            <Avatar className={keyline ? classes.greenAvatar : ''}>
              <KeylineIcon />
            </Avatar>
            <ListItemText primary="Keyline" />
            <ListItemSecondaryAction>
              <Typography variant="caption" color={keyline ? 'secondary' : 'textSecondary'} noWrap style={{ marginRight: '20px' }}>
                {keyline ? 'Online' : 'Offline'}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem onClick={this.toggleCCO} button>
            <Avatar className={cco ? classes.greenAvatar : ''}>
              C
            </Avatar>
            <ListItemText primary="CCO" />
            <ListItemSecondaryAction>
              <Typography variant="caption" color={cco ? 'secondary' : 'textSecondary'} noWrap style={{ marginRight: '20px' }}>
                {cco ? 'Online' : 'Offline'}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem onClick={this.toggleUpload} button>
            <Avatar className={upload ? classes.greenAvatar : ''}>
              <UploadIcon />
            </Avatar>
            <ListItemText primary="Upload" />
            <ListItemSecondaryAction>
              <Typography variant="caption" color={upload ? 'secondary' : 'textSecondary'} noWrap style={{ marginRight: '20px' }}>
                {upload ? 'Online' : 'Offline'}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

FolderList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(FolderList);

