import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import {welcomePage} from '../actions/actions';
import { connect } from 'react-redux';
import { Input, Button, Row, Col, Grid } from 'react-bootstrap';
import FBSignIn from './FBSignIn';
import SignIn from './SignIn';
import CenterView from './CenterView';
import TextField from 'material-ui/TextField';

class WelcomePage extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: ''
    };
  }
  componentDidMount() {
    this.refs.usernameInput.getInputDOMNode().focus();
  }
  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({ username: event.target.value });
    }
  }
  handleSubmit() {
    const { dispatch } = this.props;
    const username = this.state.username;
    dispatch(welcomePage(username));
    this.setState({ username: '' });
  }
  render() {
    const {screenWidth} = this.props;
    return (
        <main style={{display: 'flex', justifyContent: 'center'}}>
          <Grid>
            <Row className="show-grid" style={{paddingTop: '10%'}}>
              <Col xs={6} xsOffset={3}>
                <img src={require('../../../static/lion_icon.png')} alt={'logo'} style={{height:'50%', width:'50%'}} className="img-responsive center-block"/>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={6} xsOffset={3}>
                <p style={{fontFamily:'Arial',fontSize:'25', textAlign:'center'}}>N . E . S . I . M . S .</p>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={6} xsOffset={3}>
                <form style={{height: '20rem', display: 'flex', justifyContent: 'center'}}>
                  <div style={{margin: 'auto', paddingRight: '0.2em', height: '3.5em'}}>
                    <TextField>
                      <Input
                        style={{height: '2.7em', fontSize: '1.3em'}}
                        ref="usernameInput"
                        type="text"
                        name="username"
                        value={this.state.username}
                        placeholder="Enter username"
                        onChange={::this.handleChange}
                      />
                    </TextField>
                  </div>
                  <section style={{margin: 'auto', width: '12em', height: '3.5em'}}>
                    <Link to="/signup">
                      <Button
                        bsStyle="success"
                        style={{margin: 'auto', width: '12em', height: '3.5em'}}
                        type="submit"
                        onClick={::this.handleSubmit}>
                        <p style={{margin: '0', padding: '0', fontSize: '1.5em'}}>Sign Up</p>
                      </Button>
                    </Link>
                  </section>
                </form>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={6} xsOffset={3}>
                <div style={{height: '3.5em', width: '12em', alignSelf: 'center', display: 'flex', marginLeft: '1em'}}>
                  <p style={{marginRight: '1em', marginTop: '1em'}}> Or </p>
                  <Link to="/signin">
                    <Button style={{margin: 'auto', height: '3.5em'}} bsStyle="default" >Sign in</Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Grid>
        </main>
    );
  }
}

function mapStateToProps(state) {
  return {
      screenWidth: state.environment.screenWidth
  }
}

export default connect(mapStateToProps)(WelcomePage)
