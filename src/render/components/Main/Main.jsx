import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import Status from '../Status';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    overflow: 'auto',
  },
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };

    ipcRenderer.on('pdf-ready', (event, filename) => {
      this.setState(prevState => ({
        files: [...prevState.files, filename],
      }));
    });

    ipcRenderer.on('pdf-removed', (event, filename) => {
      const files = this.state.files;
      const index = files.indexOf(filename);
      files.splice(index, 1);
      this.setState({
        files,
      });
    });
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    const filePaths = [];
    files.forEach((file) => {
      filePaths.push({ path: file.path, name: file.name });
    });
    ipcRenderer.send('copy-cco', filePaths);
  }


  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Dropzone style={{ width: '100%', height: '300px', border: '1px dashed #90A4AE', borderRadius: '2px', background: '#ECEFF1', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onDrop={this.onDrop}>
          <Typography variant="caption">Drop CCO files here or click to browse.</Typography>
        </Dropzone>
        <Status files={this.state.files} />
      </main>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Main);
