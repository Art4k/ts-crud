import Car from "../types/car";
import Brand from "../types/brand";
import Model from "../types/model";
import CarJoined from "../types/car-joined";

type CarsCollectionProps = {
  cars: Car[];
  brands: Brand[];
  models: Model[];
};

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
}

export default CarsCollection;
