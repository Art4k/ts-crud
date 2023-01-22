import Car from "../types/car";
import Brand from "../types/brand";
import Model from "../types/model";
import CarJoined from "../types/car-joined";

type CarsCollectionProps = {
  cars: Car[];
  brands: Brand[];
  models: Model[];
};

export type CarProps = {
  brandId: string;
  modelId: string;
  price: number;
  year: number;
};

const generateId = (): string => String(Math.floor(Math.random() * 256));

class CarsCollection {
  private carList: CarsCollectionProps;

  constructor(carList: CarsCollectionProps) {
    this.carList = carList;
  }

  private joinCar = ({ modelId, ...car }: Car) => {
    const { brands, models } = this.carList;
    const carModel = models.find((model) => model.id === modelId);
    const carBrand = brands.find((brand) => brand.id === carModel?.brandId);

    return {
      ...car,
      brand: (carBrand && carBrand.title) ?? "Brand not found.",
      model: (carModel && carModel.title) ?? "Model not found.",
    };
  };

  public get getAllCars(): CarJoined[] {
    return this.carList.cars.map(this.joinCar);
  }

  public getByBrandId = (brandId: string): CarJoined[] => {
    const { cars, models } = this.carList;

    // eslint-disable-next-line max-len
    const brandModelsIds = models.filter((model) => model.brandId === brandId).map((model) => model.id);

    const brandCars = cars.filter((car) => brandModelsIds.includes(car.modelId)).map(this.joinCar);

    return brandCars;
  };

  public deleteCarById = (carId: string): void => {
    this.carList.cars = this.carList.cars.filter((car) => car.id !== carId);
  };

  public add = ({ modelId, brandId, ...carProps }: CarProps): void => {
    const { models, brands, cars } = this.carList;
    const model = models.find((m) => m.id === modelId);
    const brand = brands.find((b) => b.id === brandId);

    if (!model || !brand) {
      throw new Error("Netinkami duomenys sukurti automobilį");
    }

    const newCar: Car = {
      id: generateId(),
      ...carProps,
      modelId,
    };

    cars.push(newCar);
  };

  public update = (carId: string, { brandId, modelId, ...props }: CarProps) => {
    const { cars, models, brands } = this.carList;

    const updatedCarIndex = cars.findIndex((c) => c.id === carId);
    if (updatedCarIndex === -1) {
      throw new Error(`Klaida: nerastas mašinos id: '${carId}'`);
    }

    const model = models.find((m) => m.id === modelId);
    if (!model) {
      throw new Error(`Klaida: nerastas mašinos modelio id: '${modelId}'`);
    }

    const brand = brands.find((b) => b.id === brandId);
    if (!brand) {
      throw new Error(`Klaida: nerastas mašinos markės id: '${brandId}'`);
    }

    const updatedCar: Car = {
      ...cars[updatedCarIndex],
      ...props,
      modelId,
    };

    this.carList.cars.splice(updatedCarIndex, 1, updatedCar);
  };
}

export default CarsCollection;
