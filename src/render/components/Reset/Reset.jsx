import React from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import blue from '@material-ui/core/colors/blue';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ResetItem from '../ResetItem';
import Header from '../Header';
import Sidebar from '../Sidebar';

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

const HeaderBar = styled.div`
  background: #EFF3F6;
  height: 50px;
  width: 100%;
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
});

class Reset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      byHash: {},
      byId: [],
      num: 0,
      orders: {},
      loading: false,
      success: false,
    };

    this.addRow = this.addRow.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.saveRow = this.saveRow.bind(this);
    this.processRenames = this.processRenames.bind(this);
    this.removeSavedRow = this.removeSavedRow.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.addRow();

    ipcRenderer.on('rename-orders', () => {
      setTimeout(() => {
        this.setState({
          loading: false,
          orders: {},
          success: true,
        });
      }, 3000);
    });
  }

  addRow() {
    const hash = this.state.byHash;
    const id = this.state.byId;
    const num = this.state.num + 1;
    const tempHash = {
      ...hash,
      [num]: (
        <ResetItem
          remove={() => this.removeRow(num)}
          removeRow={this.removeSavedRow}
          key={num}
          save={this.saveRow}
          byId={num}
        />
      ),
    };
    const tempId = [
      ...id,
      num,
    ];
    this.setState({ byHash: tempHash, byId: tempId, num });
  }

  removeRow(id) {
    const prunedIds = this.state.byId.filter(item => item !== id);
    delete this.state.byHash[id];
    delete this.state.orders[id];

    this.setState({
      byId: prunedIds,
      byHash: this.state.byHash,
      orders: this.state.orders,
    });
  }

  saveRow(data, id) {
    const orders = this.state.orders;
    const tempOrders = {
      ...orders,
      [id]: data,
    };
    this.setState({
      orders: tempOrders,
    });
  }

  removeSavedRow(id) {
    delete this.state.orders[id];

    this.setState({
      orders: this.state.orders,
    });
  }

  processRenames() {
    this.setState({ loading: true });
    ipcRenderer.send('rename-orders', this.state.orders);
  }

  reset() {
    this.setState({ success: false });
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={customTheme}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <Header />
            <Flex>
              <Sidebar active="reset" />
              <Container>
                <HeaderBar>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    style={{ lineHeight: '50px', marginLeft: '20px' }}
                  >
                  Reset folder structure
                  </Typography>
                </HeaderBar>
                <div>
                  <List dense>
                    <TransitionGroup>
                      {this.state.byId.map(id => (
                        <CSSTransition key={id} timeout={300} classNames="fade">
                          {this.state.byHash[id]}
                        </CSSTransition>
                    ))}
                    </TransitionGroup>
                  </List>
                  <Button
                    variant="fab"
                    color="primary"
                    aria-label="add"
                    mini
                    className={classes.addBtn}
                    onClick={this.addRow}
                  >
                    <AddIcon />
                  </Button>
                </div>
              </Container>
            </Flex>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Reset.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Reset);
