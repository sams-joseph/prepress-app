import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
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

function Header({ classes }) {
  return (
    <AppBar
      position="absolute"
      elevation={0}
      className={classes.appBar}
    >
      <Toolbar>
        <div className={classes.flex} />
        <LogoIcon nativeColor="#0055B8" viewBox="0 0 40 40" style={{ fontSize: '40px' }} />
        <div className={classes.flex} />
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Header);
