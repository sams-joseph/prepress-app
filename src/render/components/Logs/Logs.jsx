import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
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
import { Container, Flex, HeaderBar, Query, ProgressContainer, TableContainer, Table, TableHeading } from './Styled';
import { styles } from './Theme';

const customTheme = createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: '#11cb5f' },
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
    ipcRenderer.send('get-logs', this.state.value);
  }

  handleChange(event, value) {
    this.setState({ value, loading: true });

    ipcRenderer.send('get-logs', value);
  }

  handleSearch(event) {
    this.setState({ loading: true });
    ipcRenderer.send('search-logs', { search: event.target.value, table: this.state.value });
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
              <Sidebar active="logs" />
              <Container>
                <HeaderBar>
                  <Tabs
                    value={value}
                    onChange={this.handleChange}
                    classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                  >
                    <Tab
                      label="Rename"
                      classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                    />
                    <Tab
                      label="Reset"
                      classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                    />
                  </Tabs>
                </HeaderBar>
                <Query>
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <SearchIcon style={{ color: '#6F8294' }} />
                    </Grid>
                    <Grid item sm={11}>
                      <FormControl fullWidth>
                        <TextField
                          id="input-with-icon-grid"
                          label="Search"
                          onChange={this.handleSearch}
                          name="search"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Query>
                <TableContainer>
                  <Table>
                    <TableHeading>
                      <Typography
                        variant="body1"
                        style={{ lineHeight: '75px', marginLeft: '20px', color: 'white', fontWeight: '300', letterSpacing: '1px' }}
                      >
                        {this.state.value === 0 ? 'Rename History' : 'Reset History'}
                      </Typography>
                    </TableHeading>
                    {this.state.loading ? (
                      <Container>
                        <ProgressContainer>
                          <CircularProgress className={classes.progress} />
                        </ProgressContainer>
                      </Container>
                    ) : (
                      <PaginatedTable orders={this.state.orders} table={this.state.value} />
                    )}
                  </Table>
                </TableContainer>
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
  history: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Logs);
