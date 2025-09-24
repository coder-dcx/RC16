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
  Card,
  CardContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import './App.css';
import NestedIfGridV2 from './components/NestedIfGridV2';
import DatabaseExampleUsage from './components/DatabaseExampleUsage';
import IFAndLookup from './components/IFAndLookup';
import EnhancedExampleUsage from './components/EnhancedExampleUsage';
import FeaturesV1Example from './components/FeaturesV1Example';

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
          <Grid item xs={12} md={3}>
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

          <Grid item xs={12} md={3}>
            <Card className={classes.card}>
              <CardContent>
                <DataUsageIcon className={classes.cardIcon} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Formula Builder
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create nested IF conditions with advanced validation
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="secondary" onClick={() => window.location.href = '/data'}>
                    Basic Component
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card className={classes.card}>
              <CardContent>
                <DataUsageIcon className={classes.cardIcon} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Database Integration
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Test component with database integration (40+ rows, ID conversion, tree structure)
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary" onClick={() => window.location.href = '/database'}>
                    Database Example
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card className={classes.card}>
              <CardContent>
                <DataUsageIcon className={classes.cardIcon} />
                <Typography variant="h5" component="h2" gutterBottom>
                  🎯 FeaturesV1
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Enhanced with Condition Type dropdown: None | IF | IF-ELSE
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" style={{ backgroundColor: '#9c27b0', color: 'white' }} onClick={() => window.location.href = '/featuresv1'}>
                    FeaturesV1 Demo
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card className={classes.card}>
              <CardContent>
                <DataUsageIcon className={classes.cardIcon} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Enhanced Builder
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Advanced builder with multiple rows under TRUE/FALSE branches
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" style={{ backgroundColor: '#ff9800', color: 'white' }} onClick={() => window.location.href = '/enhanced'}>
                    Enhanced Demo
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <DataUsageIcon className={classes.cardIcon} />
                <Typography variant="h5" component="h2" gutterBottom>
                  🚀 Complete Enhanced Demo
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Full demonstration with sample data showing multiple children, nested IFs, and complex formulas
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" style={{ backgroundColor: '#4caf50', color: 'white' }} onClick={() => window.location.href = '/enhanced-demo'}>
                    🎉 Full Enhanced Demo
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
        <Route path="/data" component={NestedIfGridV2} />
        <Route path="/database" component={DatabaseExampleUsage} />
        <Route path="/enhanced" component={IFAndLookup} />
        <Route path="/enhanced-demo" component={EnhancedExampleUsage} />
        <Route path="/featuresv1" component={FeaturesV1Example} />
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