import * as React from "react";
import * as ReactDOM from "react-dom";

import { Form, Card, Button, Row, Col } from "react-bootstrap";

import * as cars from "./cars";
import { Car, MANUAL_ENTRY } from "./cars";

const queryString = require("query-string");

export class CarSelectionCard extends React.Component<
  {
    onSelect: (car: Car | null) => void;
    onRemove: () => void;
    onHoverStart: () => void;
    onHoverEnd: () => void;
    serialized?: string;
  },
  {
    make: string | null;
    model: string | null;
    year: number | null;
    trim: string | null;

    manual: { length?: number; width?: number; height?: number };
  }
> {
  constructor(props) {
    super(props);

    if (this.props.serialized) {
      let parts = this.props.serialized.split(":");
      if (parts[0] === MANUAL_ENTRY) {
        let length = Number(parts[1]);
        let width = Number(parts[2]);
        let height = Number(parts[3]);

        this.state = {
          make: MANUAL_ENTRY,
          model: null,
          year: null,
          trim: null,
          manual: {
            length,
            width,
            height
          }
        };

        let car = {
          make: MANUAL_ENTRY,
          model: MANUAL_ENTRY,
          year: 0,
          trim: MANUAL_ENTRY,

          length,
          width,
          height
        };
        this.props.onSelect(car);
      } else {
        let make = parts[0];
        let model = parts[1];
        let year = Number(parts[2]);
        let trim = parts[3];

        this.state = { make, model, year, trim, manual: {} };

        let car = cars.getCar(make, model, year, trim);
        this.props.onSelect(car);
      }
    } else {
      this.state = {
        make: null,
        model: null,
        year: null,
        trim: null,
        manual: {}
      };
    }
  }
  render() {
    let carSize = <></>;
    if (
      this.state.make &&
      this.state.model &&
      this.state.year &&
      this.state.trim
    ) {
      let car = cars.getCar(
        this.state.make,
        this.state.model,
        this.state.year,
        this.state.trim
      );
      carSize = (
        <Form.Group>
          <span>{car.length}″ L</span> x <span>{car.width}″ W</span> x{" "}
          <span>{car.height}″ H</span>
        </Form.Group>
      );
    }
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
                value={this.state.make}
              >
                <option disabled selected></option>
                <option value={MANUAL_ENTRY}>Enter Dimensions Manually</option>
                {Array.from(cars.getMakes().values()).map(make => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {this.state.make === MANUAL_ENTRY && (
              <>
                <Form.Group key="car-length">
                  <Form.Label>Length (in.)</Form.Label>
                  <Form.Control
                    value={this.state.manual.length}
                    onChange={e => {
                      let value = e.target.value;
                      this.setState(
                        state => ({
                          manual: {
                            ...this.state.manual,
                            length: value
                          }
                        }),
                        () => this.trySelectManual()
                      );
                    }}
                    type="number"
                  />
                </Form.Group>

                <Form.Group key="car-width">
                  <Form.Label>Width (in.)</Form.Label>
                  <Form.Control
                    value={this.state.manual.width}
                    onChange={e => {
                      let value = e.target.value;
                      this.setState(
                        state => ({
                          manual: {
                            ...this.state.manual,
                            width: value
                          }
                        }),
                        () => this.trySelectManual()
                      );
                    }}
                    type="number"
                  />
                </Form.Group>

                <Form.Group key="car-height">
                  <Form.Label>Height (in.)</Form.Label>
                  <Form.Control
                    value={this.state.manual.height}
                    onChange={e => {
                      let value = e.target.value;
                      this.setState(
                        state => ({
                          manual: {
                            ...this.state.manual,
                            height: value
                          }
                        }),
                        () => this.trySelectManual()
                      );
                    }}
                    type="number"
                  />
                </Form.Group>
              </>
            )}

            {this.state.make !== MANUAL_ENTRY && (
              <>
                <Form.Group key="model-selection">
                  <Form.Label>Model</Form.Label>
                  <Form.Control
                    key={this.state.make}
                    onChange={e => this.setModel(e.target.value)}
                    as="select"
                    value={this.state.model}
                  >
                    <option disabled selected></option>
                    {this.state.make &&
                      Array.from(cars.getModels(this.state.make).values()).map(
                        model => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        )
                      )}
                  </Form.Control>
                </Form.Group>

                <Form.Group key="year-selection">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    key={this.state.model}
                    onChange={e => this.setYear(e.target.value)}
                    as="select"
                    value={this.state.year}
                  >
                    <option disabled selected></option>
                    {this.state.make &&
                      this.state.model &&
                      cars
                        .getYears(this.state.make, this.state.model)
                        .map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group key="trim-selection">
                  <Form.Label>Trim</Form.Label>
                  <Form.Control
                    key={this.state.year}
                    onChange={e => this.setTrim(e.target.value)}
                    as="select"
                    value={this.state.trim}
                  >
                    <option disabled selected></option>
                    {this.state.make &&
                      this.state.model &&
                      this.state.year &&
                      Array.from(
                        cars
                          .getTrims(
                            this.state.make,
                            this.state.model,
                            this.state.year
                          )
                          .values()
                      ).map(trim => (
                        <option key={trim} value={trim}>
                          {trim}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>

                {carSize}
              </>
            )}
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

  trySelectManual() {
    console.log(this.state);
    if (
      this.state.manual.length &&
      this.state.manual.width &&
      this.state.manual.height
    ) {
      this.props.onSelect({
        make: MANUAL_ENTRY,
        model: MANUAL_ENTRY,
        year: 0,
        trim: MANUAL_ENTRY,

        length: this.state.manual.length,
        width: this.state.manual.width,
        height: this.state.manual.height
      });
    }
  }

  setMake(make: string) {
    this.setState(state => ({
      ...state,
      make: make,
      model: null,
      year: null,
      trim: null
    }));
    this.props.onSelect(null);
  }

  setModel(model: string) {
    this.setState(state => ({
      ...state,
      model: model,
      year: null,
      trim: null
    }));
    this.props.onSelect(null);
  }

  setYear(year: number) {
    this.setState(state => ({ ...state, year: year, trim: null }));
    this.props.onSelect(null);
  }

  setTrim(trim: string) {
    this.setState(state => ({ ...state, trim: trim }));
    this.props.onSelect(
      cars.getCar(this.state.make!, this.state.model!, this.state.year!, trim)
    );
  }
}

type CardState = { id: number; car: Car | null; serialized?: string };
type CarSelectionState = { cards: Array<CardState> };

function removeNulls<T>(array: Array<T | null>): Array<T> {
  // @ts-ignore
  return array.filter(e => e !== null);
}

export class CarSelection extends React.Component<
  {
    onCarsChanged: (cars: Array<Car>) => void;
    onSelectionChanged: (selection: Car | null) => void;
  },
  CarSelectionState
> {
  constructor(props) {
    super(props);

    const data = queryString.parse(window.location.hash);
    if (data.cars) {
      let cars = data.cars;
      if (!(cars instanceof Array)) cars = [cars];
      let cards = cars.map((car, i) => ({
        id: this.generateID(),
        car: null,
        serialized: car
      }));
      this.state = { cards: cards };
    } else {
      this.state = { cards: [{ id: this.generateID(), car: null }] };
    }
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
                serialized={card.serialized}
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
    return this.lastID++;
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
