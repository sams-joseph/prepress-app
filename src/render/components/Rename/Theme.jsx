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
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
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

export default styles;
