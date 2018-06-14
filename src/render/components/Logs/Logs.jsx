import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import PaginatedTable from './PaginatedTable';

import Header from '../Header';
import Sidebar from '../Sidebar';

const Container = styled.div`
  background: #EFF3F6;
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

const Query = styled.div`
  background: white;
  padding: 30px 20px;
`;

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 40px 0;
  justify-content: center;
`;

const TableContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

const Table = styled.div`
  border-radius: 3px;
  overflow: hidden;
`;

const TableHeading = styled.div`
  background: #6F8294;
  height: 75px;
  width: 100%;
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

class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      value: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('get-logs', (event, arg) => {
      this.setState({
        orders: arg,
        loading: false,
      });
    });

    ipcRenderer.on('search-logs', (event, arg) => {
      this.setState({
        orders: arg,
        loading: false,
      });
    });
    ipcRenderer.send('get-logs', 'start');
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  handleSearch(event) {
    // this.setState({ loading: true });
    ipcRenderer.send('search-logs', event.target.value);
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <MuiThemeProvider theme={customTheme}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <Header />
            <Flex>
              <Sidebar active="logs" />
              <Container>
                <HeaderBar>
                  <Tabs value={value} onChange={this.handleChange} classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}>
                    <Tab label="Renames" classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />
                  </Tabs>
                </HeaderBar>
                <Query>
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <SearchIcon style={{ color: '#6F8294' }} />
                    </Grid>
                    <Grid item sm={11}>
                      <FormControl fullWidth>
                        <TextField id="input-with-icon-grid" label="Search" onChange={this.handleSearch} name="search" />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Query>
                {this.state.loading ? (
                  <Container>
                    <ProgressContainer>
                      <CircularProgress className={classes.progress} />
                    </ProgressContainer>
                  </Container>
            ) : (
              <TableContainer>
                <Table>
                  <TableHeading>
                    <Typography
                      variant="body1"
                      style={{ lineHeight: '75px', marginLeft: '20px', color: 'white', fontWeight: '300', letterSpacing: '1px' }}
                    >
                        Rename History
                    </Typography>
                  </TableHeading>
                  <PaginatedTable orders={this.state.orders} />
                </Table>
              </TableContainer>
                )}
              </Container>
            </Flex>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Logs.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Logs);
