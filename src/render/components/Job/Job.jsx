import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shell } from 'electron';
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
import { Container, Main, Title, Flex, HeaderBar, ProgressContainer, Divider } from './Styled';
import { styles } from './Theme';

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

        this.setState({
          job,
          jobPart,
          jobMaterials,
          jobNotes,
          jobPartItems,
          init: false,
        });
      })
        .catch(() => {
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
        .catch(() => {
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
      tabs.push(
        <Tab label={pad(i)} classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />,
      );
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
                    <Tabs
                      value={value}
                      scrollable
                      scrollButtons="auto"
                      onChange={this.handleChange}
                      classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                    >
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
                          <IconButton
                            className={classes.button}
                            aria-label="Open PDF"
                            onClick={this.openPDF}
                          >
                            <PDFIcon />
                          </IconButton>
                          <IconButton
                            className={classes.button}
                            aria-label="Open PACE"
                            onClick={this.openPart}
                          >
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
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      order: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withStyles(styles)(Job);
