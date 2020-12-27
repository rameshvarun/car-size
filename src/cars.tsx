export interface Car {
  readonly make: string;
  readonly model: string;
  readonly year: number;
  readonly trim: string;

  readonly length: number;
  readonly width: number;
  readonly height: number;

  readonly sideview?: string;
}

let DB = null;

export async function init() {
  let response = await fetch(require("../database/db.json"));
  DB = await response.json();
}

export function getMakes(): Set<string> {
  return new Set(Object.keys(DB!));
}

export function getModels(make: string): Set<string> {
  return new Set(Object.keys(DB![make]));
}

export function getYears(make: string, model: string): Array<number> {
  return Object.keys(DB![make][model])
    .map(year => Number(year))
    .sort((a, b) => b - a);
}

export function getTrims(
  make: string,
  model: string,
  year: number
): Set<string> {
  return new Set(Object.keys(DB![make][model][year]));
}

export function getCar(
  make: string,
  model: string,
  year: number,
  trim: string
): Car {
  let dimensions = DB![make][model][year][trim];
  return {
    make,
    model,
    year,
    trim,
    length: dimensions[0],
    width: dimensions[1],
    height: dimensions[2]
  };
}
