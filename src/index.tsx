import * as React from "react";
import * as ReactDOM from "react-dom";

import { Form, Card, Button, Row, Col } from "react-bootstrap";

import { SideComparision, TopComparision } from "./comparisons";

import * as cars from "./cars";
import { Car, MANUAL_ENTRY } from "./cars";
import { CarSelection } from "./selection";

const queryString = require("query-string");

class App extends React.Component<
  {},
  { cars: Array<Car>; selection: Car | null }
> {
  constructor(props) {
    super(props);
    this.state = { cars: [], selection: null };
  }

  // Save a representation of the current selection of cars to the window hash.
  updateHash() {
    let cars = this.state.cars.map(car => {
      if (car.make === MANUAL_ENTRY) {
        return `${MANUAL_ENTRY}:${car.length}:${car.width}:${car.height}`;
      } else {
        return `${car.make}:${car.model}:${car.year}:${car.trim}`;
      }
    });
    window.location.hash = queryString.stringify({ cars: cars });
  }

  render() {
    return (
      <>
        <CarSelection
          onSelectionChanged={selection => this.setState({ selection })}
          onCarsChanged={cars => {
            this.setState({ cars }, () => this.updateHash());
          }}
        />
        <Row>
          <Col md={6}>
            <h2>Side Comparision</h2>
            <SideComparision
              cars={this.state.cars}
              selection={this.state.selection}
            />
          </Col>
          <Col md={6}>
            <h2>Parking Comparision</h2>
            <TopComparision
              cars={this.state.cars}
              selection={this.state.selection}
            />
          </Col>
        </Row>
      </>
    );
  }
}

cars.init().then(() => {
  ReactDOM.render(<App />, document.getElementById("root"));
});
