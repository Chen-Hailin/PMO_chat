import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as authActions from '../actions/authActions';
import {fullWhite, red500, grey400, grey600} from 'material-ui/styles/colors';
import {TextField, IconButton} from 'material-ui';
import Report from 'material-ui/svg-icons/content/report';
import RaisedButton from 'material-ui/RaisedButton';

class SignIn extends Component {

  static propTypes = {
    welcomePage: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: this.props.welcomePage || '',
      password: ''
    };
  }
  componentDidMount() {
    if (this.state.username.length) {
      this.refs.passwordInput.focus();
    } else {
      this.refs.usernameInput.focus();
    }
  }
  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({ username: event.target.value });
    }
    if (event.target.name === 'password') {
      this.setState({ password: event.target.value });
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    if (this.state.username.length < 1) {
      this.refs.usernameInput.focus();
    }
    if (this.state.username.length > 0 && this.state.password.length < 1) {
      this.refs.passwordInput.focus();
    }
    if (this.state.username.length > 0 && this.state.password.length > 0) {
      var userObj = {
        username: this.state.username,
        password: this.state.password
      };
      dispatch(authActions.signIn(userObj))
      this.setState({ username: '', password: ''});
    }
  }
  render() {
    return (
      <div>
        <main style={{display: 'flex', justifyContent: 'center'}}>
          <div className='middle-row'>
            <div >
              <img src={require('../../../static/lion_icon.png')} alt={'logo'} style={{height:'50%', width:'50%', paddingTop:'40%'}} className="img-responsive center-block"/>
              <p style={{fontFamily:'Arial',fontSize:'25', textAlign:'center', color:'white'}}>N . E . S . I . M . S .</p>
            </div>
            <div>
              <form style={{height: '20rem', justifyContent: 'center', textAlign:'center'}}>
                <div style={{paddingRight:'48px'}}>
                  <label style={{width:100, color:grey400}} >Username</label>
                  <TextField
                    name="username"
                    placeholder="Enter username"
                    ref="usernameInput"
                    value={this.state.username}
                    onChange={::this.handleChange}
                  />
                </div>
                <br/>
                <div>
                  <label style={{width:100, color:grey400}} >Password</label>
                  <TextField onChange={::this.handleChange}
                             value={this.state.password}
                             placeholder="Enter password"
                             name="password"
                             ref="passwordInput"
                             type='password'
                  />
                  <IconButton href={'/signup/'} tooltip="Forget Login Credentials?" tooltipPosition="top-right">
                    <Report color={fullWhite} hoverColor={red500}/>
                  </IconButton>
                </div>
                <br />
                <div style={{textAlign:'center', width:'50%', marginLeft:'25%'}}>
                  <RaisedButton fullWidth={true} backgroundColor={grey600} label="Sign In" onClick={::this.handleSubmit}/>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      welcomePage: state.welcomePage,
  }
}
export default connect(mapStateToProps)(SignIn)

/*
<form onSubmit={::this.handleSubmit}>
            <Input
              label="Username"
              ref="usernameInput"
              type="text"
              name="username"
              placeholder="Enter username"
              value={this.state.username}
              onChange={::this.handleChange}
            />
            <Input
              label="Password"
              ref="passwordInput"
              type="password"
              name="password"
              placeholder="Enter password"
              value={this.state.password}
              onChange={::this.handleChange}
            />
            <Button
              bsStyle="success"
              style={{width: '100%', height: '4rem', marginTop: '2rem'}} name="submitButton"
              type="submit" >
                <p style={{color: 'white', margin: '0', padding: '0', fontSize: '1.5em'}} >Sign In</p>
            </Button>
          </form>
 */