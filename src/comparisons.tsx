import * as React from "react";
import { Car } from "./cars/";

export class TopComparision extends React.Component<
  { selection: Car | null; cars: Array<Car> },
  {}
> {
  render() {
    if (this.props.cars.length == 0) return <div>No cars selected.</div>;

    let parkingLength = 18 * 12;
    let parkingWidth = 7.5 * 12;

    let MARGIN = 5;

    let maxLength = Math.max(...this.props.cars.map(car => car.length));
    let maxWidth = Math.max(...this.props.cars.map(car => car.width));
    let viewBox = `${-MARGIN} ${-MARGIN} ${parkingLength +
      2 * MARGIN} ${parkingWidth + 2 * MARGIN}`;
    return (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
          <rect
            x="0"
            y="0"
            width={parkingLength}
            height={parkingWidth}
            style={{ fill: "transparent", stroke: "black", strokeWidth: 3 }}
          />
          {this.props.cars.map(car => {
            let opacity =
              this.props.selection === car ? 1.0 : 1 / this.props.cars.length;
            let key = `${car.make}-${car.model}-${car.year}`;
            return (
              <rect
                key={key}
                opacity={opacity}
                x={(parkingLength - car.length) / 2}
                y={(parkingWidth - car.width) / 2}
                width={car.length}
                height={car.width}
              />
            );
          })}
        </svg>
      </>
    );
  }
}

export class SideComparision extends React.Component<
  { selection: Car | null; cars: Array<Car> },
  {}
> {
  render() {
    if (this.props.cars.length == 0) return <div>No cars selected.</div>;

    let maxLength = Math.max(...this.props.cars.map(car => car.length));
    let maxHeight = Math.max(...this.props.cars.map(car => car.height));
    let viewBox = `0 0 ${maxLength} ${maxHeight}`;

    let cars = this.props.cars
      .filter(car => car !== this.props.selection)
      .sort((a, b) => b.length - a.length);
    if (this.props.selection) cars.push(this.props.selection);

    return (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
          {cars.map(car => {
            let opacity =
              this.props.selection === car ? 1.0 : 1 / this.props.cars.length;
            let x = maxLength - car.length;
            let y = maxHeight - car.height;
            let key = `${car.make}-${car.model}-${car.year}`;
            if (car.sideview) {
              return (
                <image
                  key={key}
                  opacity={opacity}
                  preserveAspectRatio="none"
                  href={car.sideview}
                  x={x}
                  y={y}
                  width={car.length}
                  height={car.height}
                ></image>
              );
            } else {
              return (
                <rect
                  key={key}
                  opacity={opacity}
                  x={x}
                  y={y}
                  width={car.length}
                  height={car.height}
                />
              );
            }
          })}
        </svg>
      </>
    );
  }
}
