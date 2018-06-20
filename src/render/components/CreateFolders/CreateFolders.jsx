import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Header from '../Header';
import Sidebar from '../Sidebar';

const Container = styled.div`
  background: white;
  width: 100%;
  margin-top: 64px;
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Flex = styled.div`
  display: flex;
  width: 100%;
`;

const HeaderBar = styled.div`
  background: #EFF3F6;
  height: 50px;
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
  background: white;
  padding: 20px;
  flex: 1;
`;

const ActionButton = styled.button`
  width: 170px;
  height: 30px;
  background: #039be5;
  color: white;
  margin: 20px 0;
  border: none;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 2px rgba(0,0,0,0.125);
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    opacity: 0.75;
  }

  &:disabled {
    background: rgba(0,0,0,0.25);
    color: rgba(255,255,255, 0.5);
    box-shadow: 0px 1px 6px 2px rgba(0,0,0,0);
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  width: 100%;
  padding-top: 64px;
  overflow: auto;
  background: white;
`;

export const CheckmarkCircle = styled.circle`
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #33b257;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }
`;

export const Checkmark = styled.svg`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 0 auto 30px auto;
  box-shadow: inset 0px 0px 0px #33b257;
  animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 50px #33b257;
    }
  }
  @keyframes scale {
    0%,
    100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }
`;

export const CheckmarkCheck = styled.path`
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }
`;

const drawerWidth = 240;

const customTheme = createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: '#11cb5f' },
  },
});

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
    margin: theme.spacing.unit,
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
  tabsRoot: {
    borderBottom: 'none',
  },
  tabsIndicator: {
    backgroundColor: '#039BDF',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: theme.spacing.unit * 4,
    transition: 'all 0.125s',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#039BDF',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
});

class CreateFolders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: '',
      success: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('create-folders', () => {
      this.setState({
        success: true,
      });
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({
      success: true,
    });

    ipcRenderer.send('create-folders', this.state.order);
  }

  handleChange(e) {
    this.setState({
      order: e.target.value,
    });
  }

  reset() {
    this.setState({ success: false, order: '' });
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={customTheme}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <Header history={this.props.history} />
            <Flex>
              <Sidebar active="create" />
              <Container>
                <HeaderBar>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    style={{ lineHeight: '50px', marginLeft: '20px' }}
                  >
                  Create WIP Folders
                  </Typography>
                </HeaderBar>
                {this.state.success ? (
                  <Message>
                    <Checkmark xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                      <CheckmarkCircle cx="26" cy="26" r="25" fill="none" />
                      <CheckmarkCheck fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </Checkmark>
                    <Typography className={classes.type} variant="title">Success</Typography>
                    <Typography
                      className={classes.type}
                      variant="subheading"
                    >
                      Folders Created
                    </Typography>
                    <Button
                      variant="flat"
                      color="primary"
                      aria-label="run"
                      mini
                      className={classes.successBtn}
                      onClick={this.reset}
                    >
                    New Folder
                    </Button>
                  </Message>
                ) : (
                  <Form onSubmit={this.onSubmit}>
                    <div>
                      <FormControl>
                        <TextField id="input-with-icon-grid" label="Order" onChange={this.handleChange} value={this.state.order} name="order" />
                      </FormControl>
                    </div>
                    <ActionButton
                      aria-label="run"
                      type="submit"
                    >
                  Create
                    </ActionButton>
                  </Form>
                )}
              </Container>
            </Flex>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

CreateFolders.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(CreateFolders);
