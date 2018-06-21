import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Store from 'electron-store';
import Header from '../Header';
import Sidebar from '../Sidebar';

const store = new Store();

const Container = styled.div`
  width: 100%;
  margin-top: 64px;
  overflow: auto;
  flex: 1;
`;

const Flex = styled.div`
  display: flex;
  width: 100%;
`;

const ActionButton = styled.button`
  width: 160px;
  height: 30px;
  background: #039be5;
  color: white;
  margin: 0 20px 40px 20px;
  border: none;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 2px rgba(0,0,0,0.25);
  cursor: pointer;

  &:disabled {
    background: rgba(0,0,0,0.25);
    color: rgba(255,255,255, 0.5);
    box-shadow: 0px 1px 6px 2px rgba(0,0,0,0);
    cursor: not-allowed;
  }
`;

const HeaderBar = styled.div`
  background: #EFF3F6;
  height: 50px;
  width: 100%;
`;

const customTheme = createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: '#11cb5f' },
  },
});

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  list: {
    borderBottom: `1px solid ${theme.palette.divider}`,
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
    zIndex: theme.zIndex.drawer + 1,
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
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  button: {
    margin: '20px 0',
  },
  addBtn: {
    position: 'absolute',
    right: '20px',
    bottom: '20px',
  },
  successBtn: {
    margin: '20px 0',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  type: {
    textAlign: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    marginRight: '20px',
  },
  input: {
    margin: theme.spacing.unit,
  },
  title: {
    margin: '0 0 30px 0',
  },
  textField: {
    cursor: 'pointer',
  },
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      g33store: store.get('g33store'),
      edited: false,
    };

    this.selectDirectory = this.selectDirectory.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('select-directory', (err, directory) => {
      this.setState({
        g33store: directory,
        edited: true,
      });
    });

    ipcRenderer.on('save-settings', () => {
      this.setState({
        edited: false,
      });
    });
  }

  selectDirectory() {
    ipcRenderer.send('select-directory', this.state.g33store);
  }

  saveSettings() {
    ipcRenderer.send('save-settings', this.state.g33store);
  }

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={customTheme}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <Header history={this.props.history} />
            <Flex>
              <Sidebar active="settings">
                <ActionButton
                  aria-label="save"
                  disabled={!this.state.edited}
                  onClick={this.saveSettings}
                >
                  {this.state.edited ? 'Save' : 'Saved'}
                </ActionButton>
              </Sidebar>
              <Container>
                <HeaderBar>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    style={{ lineHeight: '50px', marginLeft: '20px' }}
                  >
                  Settings
                  </Typography>
                </HeaderBar>
                <form style={{ padding: '20px' }}>
                  <FormControl fullWidth>
                    <TextField
                      id="g33store"
                      label="G33STORE"
                      className={classes.textField}
                      value={this.state.g33store}
                      onClick={this.selectDirectory}
                      margin="dense"
                      disabled
                    />
                  </FormControl>
                </form>
              </Container>
            </Flex>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Settings);
