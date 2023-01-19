import CarsCollection from "../helpers/cars-collection";
import stringifyProps, { StringifyObjectProps } from "../helpers/stingify-object";

import CarJoined from "../types/car-joined";
import Table from "./table";
import SelectField from "./selectfield";
// Data imports
import cars from "../data/cars";
import brands from "../data/brands";
import models from "../data/models";

class App {
  private htmlElement: HTMLElement;

  private carsCollection: CarsCollection;

  private selectedBrandId: null | string;

  private carTable: Table<StringifyObjectProps<CarJoined>>;

  private filterByBrand: SelectField;

  constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);
    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.carsCollection = new CarsCollection({ cars, brands, models });

    this.carTable = new Table({
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

    this.filterByBrand = new SelectField({
      label: "Modelis",
      onChange: this.handleBrandChange,
      options: brands.map(({ id, title }) => ({ title, value: id })),
    });

    this.selectedBrandId = null;

    this.htmlElement = foundElement;
  }

  private handleBrandChange = (brandId: string): void => {
    this.selectedBrandId = brandId;

    this.update();
  };

  private update = (): void => {
    const { selectedBrandId, carsCollection } = this;

    if (selectedBrandId === null) {
      this.carTable.updateProps({
        title: "Visi automobiliai",
        rowsData: carsCollection.getAllCars.map(stringifyProps),
      });
    } else {
      const brand = brands.find((b) => b.id === selectedBrandId);
      if (brand === undefined) throw new Error("Pasirinkta neegzistuojanti markė");

      this.carTable.updateProps({
        title: `${brand.title} markės automobiliai`,
        rowsData: carsCollection.getByBrandId(selectedBrandId).map(stringifyProps),
      });
    }
  };

  initialize = (): void => {
    const container = document.createElement("div");
    container.className = "container d-flex flex-row my-5";
    container.append(this.filterByBrand.htmlElement, this.carTable.htmlElement);

    this.htmlElement.append(container);
  };
}

export default App;
