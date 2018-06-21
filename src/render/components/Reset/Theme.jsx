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
});

export default styles;
