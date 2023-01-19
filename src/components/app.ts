import CarsCollection from "../helpers/cars-collection";
import stringifyProps from "../helpers/stingify-object";

import Table from "./table";
import SelectField from "./selectfield";
// Data imports
import cars from "../data/cars";
import brands from "../data/brands";
import models from "../data/models";

class App {
  private htmlElement: HTMLElement;

  private carsCollection: CarsCollection;

  private filterByBrand: SelectField;

  constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);

    this.carsCollection = new CarsCollection({ cars, brands, models });

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.htmlElement = foundElement;
    this.filterByBrand = new SelectField({
      label: "BrandName",
      onChange: console.log("Filtruoja !"),
      options: brands.map(({ id, title }) => ({ title, value: id })),
    });
  }

  initialize = (): void => {
    const carTable = new Table({
      title: "Visi automobiliai",
      columns: {
        id: "Id",
        brand: "Markė",
        model: "Modelis",
        price: "Kaina",
        year: "Metai",
      },
      rowsData: this.carsCollection.getAllCars.map(stringifyProps),
    });
    const container = document.createElement("div");
    container.className = "container my-5";
    container.appendChild(carTable.htmlElement);

    this.htmlElement.append(container);
  };
}

export default App;
