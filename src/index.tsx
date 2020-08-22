import * as React from "react";
import * as ReactDOM from "react-dom";

import { Form, Card, Button, Row, Col } from "react-bootstrap";

import { Car, CARS } from "./cars/";
import { SideComparision, TopComparision } from "./comparisons";

const MAKES: Set<string> = new Set();
for (let car of CARS) {
  MAKES.add(car.make);
}

function getModels(make: string): Set<string> {
  let models: Set<string> = new Set();
  for (let car of CARS) {
    if (car.make === make) {
      models.add(car.model);
    }
  }
  return models;
}

function getYears(make: string, model: string): Array<number> {
  let years: Set<number> = new Set();
  for (let car of CARS) {
    if (car.make === make && car.model == model) {
      years.add(car.year);
    }
  }
  return Array.from(years.values()).sort();
}

function getCar(make: string, model: string, year: number): Car {
  for (let car of CARS) {
    if (car.make === make && car.model == model && car.year == year) {
      return car;
    }
  }
  throw new Error(`Couldn't find a car.`);
}

class CarSelectionCard extends React.Component<
  {
    onSelect: (car: Car | null) => void;
    onRemove: () => void;
    onHoverStart: () => void;
    onHoverEnd: () => void;
  },
  { make: string | null; model: string | null; year: number | null }
> {
  constructor(props) {
    super(props);
    this.state = { make: null, model: null, year: null };
  }
  render() {
    return (
      <Card
        onMouseEnter={() => this.props.onHoverStart()}
        onMouseLeave={() => this.props.onHoverEnd()}
      >
        <Card.Body>
          <Form>
            <Form.Group key="make-selection">
              <Form.Label>Make</Form.Label>
              <Form.Control
                onChange={e => this.setMake(e.target.value)}
                as="select"
              >
                <option disabled selected></option>
                {Array.from(MAKES.values()).map(make => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group key="model-selection">
              <Form.Label>Model</Form.Label>
              <Form.Control
                key={this.state.make}
                onChange={e => this.setModel(e.target.value)}
                as="select"
              >
                <option disabled selected></option>
                {this.state.make &&
                  Array.from(getModels(this.state.make).values()).map(model => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group key="year-selection">
              <Form.Label>Year</Form.Label>
              <Form.Control
                key={this.state.model}
                onChange={e => this.setYear(e.target.value)}
                as="select"
              >
                <option disabled selected></option>
                {this.state.make &&
                  this.state.model &&
                  getYears(this.state.make, this.state.model).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Form>
          <Button
            variant="outline-danger"
            onClick={() => this.props.onRemove()}
          >
            Remove
          </Button>
        </Card.Body>
      </Card>
    );
  }

  setMake(make: string) {
    this.setState(state => ({ ...state, make: make, model: null, year: null }));
    this.props.onSelect(null);
  }

  setModel(model: string) {
    this.setState(state => ({ ...state, model: model, year: null }));
    this.props.onSelect(null);
  }

  setYear(year: number) {
    this.setState(state => ({ ...state, year: year }));
    this.props.onSelect(getCar(this.state.make!, this.state.model!, year));
  }
}

type CardState = { id: number; car: Car | null };
type CarSelectionState = { cards: Array<CardState> };

function removeNulls<T>(array: Array<T | null>): Array<T> {
  // @ts-ignore
  return array.filter(e => e !== null);
}

class CarSelection extends React.Component<
  {
    onCarsChanged: (cars: Array<Car>) => void;
    onSelectionChanged: (selection: Car | null) => void;
  },
  CarSelectionState
> {
  constructor(props) {
    super(props);
    this.state = { cards: [{ id: 0, car: null }] };
  }
  render() {
    return (
      <>
        <Row>
          {this.state.cards.map(card => (
            <Col
              key={card.id}
              sm={6}
              md={4}
              lg={3}
              style={{ paddingBottom: "15px" }}
            >
              <CarSelectionCard
                onHoverStart={() => this.props.onSelectionChanged(card.car)}
                onHoverEnd={() => this.props.onSelectionChanged(null)}
                onSelect={car => this.setCar(card, car)}
                onRemove={() => {
                  this.setState(
                    state => {
                      return {
                        cards: state.cards.filter(c => c !== card)
                      };
                    },
                    () => {
                      this.updateCars();
                    }
                  );
                }}
              />
            </Col>
          ))}

          <Col
            sm={6}
            md={4}
            lg={3}
            style={{
              paddingBottom: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Button
              onClick={() =>
                this.setState(state => {
                  state.cards.push({ id: this.generateID(), car: null });
                  return state;
                })
              }
              variant="outline-primary"
            >
              Add a Car
            </Button>
          </Col>
        </Row>
      </>
    );
  }

  lastID: number = 0;
  generateID(): number {
    return ++this.lastID;
  }

  setCar(card: CardState, car: Car | null) {
    this.setState(
      state => {
        card.car = car;
        return state;
      },
      () => {
        this.updateCars();
      }
    );
  }

  updateCars() {
    this.props.onCarsChanged(removeNulls(this.state.cards.map(car => car.car)));
  }
}

class App extends React.Component<
  {},
  { cars: Array<Car>; selection: Car | null }
> {
  constructor(props) {
    super(props);
    this.state = { cars: [], selection: null };
  }
  render() {
    return (
      <>
        <CarSelection
          onSelectionChanged={selection => this.setState({ selection })}
          onCarsChanged={cars => this.setState({ cars })}
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

ReactDOM.render(<App />, document.getElementById("root"));
