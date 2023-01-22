import CarsCollection, { CarProps } from "../helpers/cars-collection";
import stringifyProps, { StringifyObjectProps } from "../helpers/stingify-object";

import CarJoined from "../types/car-joined";
import Table from "./table";
import SelectField from "./selectfield";
import CarForm, { Values } from "./car-form";

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

  private carForm: CarForm;

  private editedCarId: string | null;

  public constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.selectedBrandId = null;

    this.editedCarId = null;

    this.htmlElement = foundElement;

    const initialBrandId = brands[0].id;

    this.carsCollection = new CarsCollection({ cars, brands, models });

    this.filterByBrand = new SelectField({
      label: "Modelis",
      options: [{ title: "Visi automobiliai", value: "-1" }, ...brands.map(({ id, title }) => ({ title, value: id }))],
      onChange: this.handleBrandChange,
    });

    this.carForm = new CarForm({
      title: "Sukurkite naują automobilį",
      submitBtnText: "Sukurti",
      values: {
        brand: initialBrandId,
        model: models.filter((m) => m.brandId === initialBrandId)[0].id,
        price: "10000",
        year: "2023",
      },
      isEdited: Boolean(this.editedCarId),
      onSubmit: this.handleCreateCar,
    });

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
      onDelete: this.handleCarDelete,
      onEdit: this.handleCarEdit,
      editedCarId: this.editedCarId,
    });
  }

  private handleBrandChange = (brandId: string): void => {
    const brand = brands.find((b) => b.id === brandId);
    this.selectedBrandId = brand ? brandId : null;

    this.update();
  };

  // eslint-disable-next-line object-curly-newline
  private handleCreateCar = ({ brand, model, price, year }: Values): void => {
    const carProps: CarProps = {
      brandId: brand,
      modelId: model,
      price: Number(price),
      year: Number(year),
    };

    this.carsCollection.add(carProps);

    this.update();
  };

  private handleCarEdit = (carId: string) => {
    if (this.editedCarId === carId) {
      this.editedCarId = null;
    } else {
      this.editedCarId = carId;
    }

    this.update();
  };

  private handleCarDelete = (carId: string) => {
    this.carsCollection.deleteCarById(carId);

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
    const createContainer = document.createElement("div");
    createContainer.className = "d-flex align-items-start";
    createContainer.append(this.carForm.htmlElement);
    const container = document.createElement("div");

    container.className = "container d-flex flex-row my-5";

    container.append(this.filterByBrand.htmlElement, this.carTable.htmlElement, createContainer);

    this.htmlElement.append(container);
  };
}

export default App;
