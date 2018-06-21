import React from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Header from '../Header';
import Sidebar from '../Sidebar';
import { styles } from './Theme';
import { Container, Flex, HeaderBar, Form, ActionButton, Message, CheckmarkCircle, Checkmark, CheckmarkCheck } from './Styled';

const customTheme = createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: '#11cb5f' },
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
                        <TextField
                          id="input-with-icon-grid"
                          label="Order"
                          onChange={this.handleChange}
                          value={this.state.order}
                          name="order"
                        />
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
  history: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(CreateFolders);
