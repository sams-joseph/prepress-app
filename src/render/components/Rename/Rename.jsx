import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Reorder from '../Reorder';
import ReorderMetroItem from '../ReorderMetroItem';
import Header from '../Header';
import Sidebar from '../Sidebar';

import { Container, Flex, ActionButton, HeaderBar, Message, ProgressContainer, CheckmarkCircle, Checkmark, CheckmarkCheck } from './Styled';
import styles from './Theme';

const customTheme = createMuiTheme({
  palette: {
    primary: { main: '#039be5' },
    secondary: { main: '#00c853' },
  },
});

class Rename extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      byHash: {},
      byId: [],
      num: 0,
      orders: {},
      loading: false,
      success: false,
      value: 0,
    };

    this.addRow = this.addRow.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.saveRow = this.saveRow.bind(this);
    this.processRenames = this.processRenames.bind(this);
    this.removeSavedRow = this.removeSavedRow.bind(this);
    this.reset = this.reset.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

    ipcRenderer.on('rename-metro', () => {
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
    const value = this.state.value;
    const num = this.state.num + 1;
    let tempHash = {};

    if (value === 0) {
      tempHash = {
        ...hash,
        [num]: (
          <Reorder
            remove={() => this.removeRow(num)}
            removeRow={this.removeSavedRow}
            key={num}
            save={this.saveRow}
            byId={num}
          />),
      };
    } else {
      tempHash = {
        ...hash,
        [num]: (
          <ReorderMetroItem
            remove={() => this.removeRow(num)}
            removeRow={this.removeSavedRow}
            key={num}
            save={this.saveRow}
            byId={num}
          />),
      };
    }
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
    if (this.state.value === 0) {
      ipcRenderer.send('rename-orders', this.state.orders);
    } else {
      ipcRenderer.send('rename-metro', this.state.orders);
    }
  }

  reset() {
    this.setState({ success: false, byHash: {}, byId: [] }, () => {
      this.addRow();
    });
  }

  handleChange(event, value) {
    this.setState({
      byId: [],
      byHash: {},
      orders: {},
      value,
    }, () => {
      setTimeout(() => {
        this.addRow();
      }, 250);
    });
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <MuiThemeProvider theme={customTheme}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <Header history={this.props.history} />
            <Flex>
              <Sidebar active="home">
                <ActionButton
                  aria-label="run"
                  disabled={
                    this.state.byId.length !==
                    Object.keys(this.state.orders).length ||
                    this.state.byId.length < 1
                  }
                  onClick={this.processRenames}
                >
                  Run
                </ActionButton>
              </Sidebar>
              <Container>
                <HeaderBar>
                  <Tabs
                    value={value}
                    onChange={this.handleChange}
                    classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                  >
                    <Tab
                      label="Pace"
                      classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                    />
                    <Tab
                      label="Metrodata"
                      classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                    />
                  </Tabs>
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
                      Renames Generated
                    </Typography>
                    <Button
                      variant="flat"
                      color="primary"
                      aria-label="run"
                      mini
                      className={classes.successBtn}
                      onClick={this.reset}
                    >
                    New Rename
                    </Button>
                  </Message>
              ) : (
                  this.state.loading ? (
                    <ProgressContainer>
                      <CircularProgress className={classes.progress} />
                    </ProgressContainer>
                  ) : (
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
                    )
                )}
              </Container>
            </Flex>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Rename.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Rename);
