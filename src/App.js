import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Grid,
  Paper,
  Card,
  CardContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import './App.css';

// Import components (to be created later)
// import Dashboard from './components/Dashboard';
// import DataGrid from './components/DataGrid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    marginBottom: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  content: {
    marginTop: theme.spacing(2),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  cardIcon: {
    fontSize: '3rem',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const WelcomePage = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to RC16-IC Application
        </Typography>
        <Typography variant="h6" color="textSecondary" align="center" paragraph>
          A modern React application with Material-UI, Redux, and advanced data handling capabilities
        </Typography>

        <Grid container spacing={4} className={classes.content}>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <DashboardIcon className={classes.cardIcon} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Dashboard
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View comprehensive analytics and key performance indicators
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    Go to Dashboard
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <DataUsageIcon className={classes.cardIcon} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Data Management
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage and analyze your data with advanced grid functionality
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="secondary">
                    Manage Data
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            RC16-IC Application
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Switch>
        <Route exact path="/" component={WelcomePage} />
        {/* Add more routes here as you develop components */}
        {/* <Route path="/dashboard" component={Dashboard} /> */}
        {/* <Route path="/data" component={DataGrid} /> */}
      </Switch>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // Map Redux state to props here
});

const mapDispatchToProps = {
  // Map action creators to props here
};

export default connect(mapStateToProps, mapDispatchToProps)(App);