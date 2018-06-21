import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import blue from '@material-ui/core/colors/blue';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ResetItem from '../ResetItem';
import Header from '../Header';
import Sidebar from '../Sidebar';

import { Container, Flex, HeaderBar } from './Style';
import styles from './Theme';

const customTheme = createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: '#11cb5f' },
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
            <Header history={this.props.history} />
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
  history: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Reset);
