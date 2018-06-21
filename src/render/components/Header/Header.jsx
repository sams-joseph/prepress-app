import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Toolbar from '@material-ui/core/Toolbar';
import LogoIcon from './LogoIcon';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  appBar: {
    background: 'white',
    zIndex: theme.zIndex.drawer + 1,
    '-webkit-app-region': 'drag',
    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.25)',
  },
  toolbar: theme.mixins.toolbar,
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.history.push(`/job/${this.state.query}`);
  }

  onChange(e) {
    this.setState({
      query: e.target.value,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar
        position="absolute"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar>
          <div className={classes.flex} />
          <LogoIcon nativeColor="#0055B8" viewBox="0 0 40 40" style={{ fontSize: '40px' }} />
          <div className={classes.flex}>
            <Grid container alignItems="flex-end" justify="flex-end">
              <Grid item>
                <form onSubmit={e => this.onSubmit(e)}>
                  <FormControl className={classes.margin}>
                    <Input
                      id="input-with-icon-adornment"
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon style={{ color: '#6F8294' }} />
                        </InputAdornment>
                      }
                      onChange={e => this.onChange(e)}
                    />
                  </FormControl>
                </form>
              </Grid>
            </Grid>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default withStyles(styles)(Header);
