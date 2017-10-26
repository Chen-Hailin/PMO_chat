import { Row, Col, Grid } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

export default class CenterView extends React.Component {
  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={1} md={4}></Col>
          <Col xs={4} md={4}>{this.props.children}</Col>
          <Col xs={1} md={4}></Col>
        </Row>
      </Grid>
    )
  }
}