import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shell } from 'electron';
import styled from 'styled-components';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import LaunchIcon from '@material-ui/icons/Launch';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { token } from '../../../config';

const Container = styled.div`
  width: 100%;
  margin-top: 64px;
  overflow: auto;
  flex: 1;
`;

const Main = styled.div`
  width: 100%;
  padding: 20px;
  flex: 1;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
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

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 40px 0;
  justify-content: center;
`;

const Divider = styled.hr`
  border: 0;
  background: #EFF3F6;
  height: 2px;
  margin: 20px 0;
`;

const pad = (num) => {
  let s = String(num);
  while (s.length < 2) { s = `0${s}`; }
  return s;
};

const convertInches = (inches) => {
  const feetFromInches = Math.floor(inches / 12);
  const inchesRemainder = Math.round((inches % 12) * 100) / 100;

  const result = `${feetFromInches}'-${inchesRemainder}"`;
  return result;
};

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
    margin: '0',
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
  tabsRoot: {
    borderBottom: '1px solid #dce2e5',
  },
  tabsIndicator: {
    backgroundColor: '#039BDF',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
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

class Job extends Component {
  constructor(props) {
    super(props);

    this.state = {
      job: {},
      jobPart: {},
      jobMaterials: {},
      jobNotes: {},
      jobPartItems: {},
      value: 0,
      init: true,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.openPart = this.openPart.bind(this);
    this.openPDF = this.openPDF.bind(this);
  }

  componentDidMount() {
    const order = this.props.match.params.order;
    axios
      .get(`https://orders.mmt.com/api/?job=${order}&part=01&token=${token}`)
      .then((result) => {
        const {
          job,
          jobPart,
          jobMaterials,
          jobNotes,
          jobPartItems,
        } = result.data;

        console.log(jobPart);

        this.setState({
          job,
          jobPart,
          jobMaterials,
          jobNotes,
          jobPartItems,
          init: false,
        });
      })
        .catch((err) => {
          alert(err);
        });
  }

  handleChange(event, value) {
    this.setState({
      value,
      loading: true,
    });

    const order = this.props.match.params.order;
    const part = pad(value + 1);
    axios
      .get(`https://orders.mmt.com/api/?job=${order}&part=${part}&token=${token}`)
      .then((result) => {
        const {
          jobPart,
          jobMaterials,
          jobNotes,
          jobPartItems,
        } = result.data;

        this.setState({
          jobPart,
          jobMaterials,
          jobNotes,
          jobPartItems,
          loading: false,
        });
      })
        .catch((err) => {
          alert(err);
        });
  }

  openPart() {
    shell.openExternal(`https://epace.mmt.com/epace/company:public/object/JobPart/detail/${this.state.job.job}%3A${this.state.jobPart.jobPart}`);
  }

  openPDF() {
    shell.openItem(`/Volumes/G33STORE/_tFlow_Hotfolders/csr_repository/${this.state.job.job}P${this.state.jobPart.jobPart}.pdf`);
  }

  render() {
    const { classes } = this.props;
    const { value, init, loading, jobPart } = this.state;

    const tabs = [];
    for (let i = 1; i <= this.state.job.totalParts; i += 1) {
      tabs.push(<Tab label={pad(i)} classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />);
    }

    return (
      <MuiThemeProvider theme={customTheme}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <Header history={this.props.history} />
            <Flex>
              <Sidebar />
              {init ? (
                <Container>
                  <ProgressContainer>
                    <CircularProgress className={classes.progress} />
                  </ProgressContainer>
                </Container>
              ) : (
                <Container>
                  <HeaderBar>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ lineHeight: '50px', marginLeft: '20px' }}
                    >
                    ORDER | {this.props.match.params.order} {this.state.job.description}
                    </Typography>
                  </HeaderBar>
                  <HeaderBar>
                    <Tabs value={value} scrollable scrollButtons="auto" onChange={this.handleChange} classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}>
                      {
                      tabs
                    }
                    </Tabs>
                  </HeaderBar>
                  {loading ? (
                    <Main>
                      <ProgressContainer>
                        <CircularProgress className={classes.progress} />
                      </ProgressContainer>
                    </Main>
                  ) : (
                    <Main>
                      <Title>
                        <div>
                          <Typography
                            variant="subheading"
                            color="primary"
                          >
                            {this.state.jobPart.description}
                          </Typography>
                        </div>
                        <div>
                          <IconButton className={classes.button} aria-label="Open PDF" onClick={this.openPDF}>
                            <PDFIcon />
                          </IconButton>
                          <IconButton className={classes.button} aria-label="Open PACE" onClick={this.openPart}>
                            <LaunchIcon />
                          </IconButton>
                        </div>
                      </Title>
                      <Grid container spacing={8} alignItems="flex-start">
                        <Grid item sm={3}>
                          <Typography
                            variant="body2"
                            color="default"
                          >
                            Visible
                          </Typography>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                          >
                            {`${jobPart.finalSizeH}" x ${jobPart.finalSizeW}"`}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                          >
                            {`${convertInches(jobPart.finalSizeH)} x ${convertInches(jobPart.finalSizeW)}`}
                          </Typography>
                        </Grid>
                        <Grid item sm={3}>
                          <Typography
                            variant="body2"
                            color="default"
                          >
                            Painted
                          </Typography>

                          <Typography
                            variant="body1"
                            color="textSecondary"
                          >
                            {`${jobPart.U_trimSizeLength}" x ${jobPart.U_trimSizeWidth}"`}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                          >
                            {`${convertInches(jobPart.U_trimSizeLength)} x ${convertInches(jobPart.U_trimSizeWidth)}`}
                          </Typography>
                        </Grid>
                        <Grid item sm={3}>
                          <Typography
                            variant="body2"
                            color="default"
                          >
                            Overall
                          </Typography>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                          >
                            {`${jobPart.U_flatSizeLength}" x ${jobPart.U_flatSizeWidth}"`}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                          >
                            {`${convertInches(jobPart.U_flatSizeLength)} x ${convertInches(jobPart.U_flatSizeWidth)}`}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                      <Grid container spacing={8} alignItems="flex-start">
                        <Grid item sm={6}>
                          <Typography
                            variant="body2"
                            color="default"
                          >Finishing</Typography>
                          {
                          this.state.jobPartItems.map(item => (
                            <Typography
                              variant="body1"
                              color="textSecondary"
                            >
                              {item.name}
                            </Typography>
                          ))
                        }
                        </Grid>
                        <Grid item sm={6}>
                          <Typography
                            variant="body2"
                            color="default"
                          >
                            Notes
                          </Typography>
                          {
                          this.state.jobNotes.map(item => (
                            <Typography
                              variant="body1"
                              color="textSecondary"
                            >
                              {item.note}
                            </Typography>
                          ))
                        }
                        </Grid>
                      </Grid>
                    </Main>
                  )}
                </Container>
              )}
            </Flex>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Job.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Job);
