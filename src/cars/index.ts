export interface Car {
  readonly make: string;
  readonly model: string;
  readonly year: number;

  readonly length: number;
  readonly width: number;
  readonly height: number;

  readonly sideview?: string;
}

import { TOYOTA_CARS } from "./toyota";
import { HONDA_CARS } from "./honda";
import { TESLA_CARS } from "./tesla";
import { BUICK_CARS } from "./buick";
import { MAZDA_CARS } from "./mazda";
import { LEXUS_CARS } from "./lexus";
import { SUBARU_CARS } from "./subaru";
import { VW_CARS } from "./vw";
import { HYUNDAI_CARS } from "./hyundai";
import { CHEVY_CARS } from "./chevy";
import { NISSAN_CARS } from "./nissan";
import { VOLVO_CARS } from "./volvo";
import { KIA_CARS } from "./kia";

export var CARS: Array<Car> = ([] as Array<Car>).concat(
  TOYOTA_CARS,
  HONDA_CARS,
  TESLA_CARS,
  BUICK_CARS,
  MAZDA_CARS,
  LEXUS_CARS,
  SUBARU_CARS,
  VW_CARS,
  HYUNDAI_CARS,
  CHEVY_CARS,
  NISSAN_CARS,
  VOLVO_CARS,
  KIA_CARS
);
