import SelectField from "./selectfield";
import TextField from "./text-field";

import brands from "../data/brands";
import models from "../data/models";

export type Values = {
  brand: string;
  model: string;
  price: string;
  year: string;
};

type CarFormProps = {
  title: string;
  values: Values;
  submitBtnText: string;
  onSubmit: (values: Values) => void;
  isEdited: boolean;
};

type Fields = {
  brand: SelectField;
  model: SelectField;
  price: TextField;
  year: TextField;
};

class CarForm {
  private props: CarFormProps;

  public htmlElement: HTMLFormElement;

  private htmlFormHeader: HTMLHeadingElement;

  private htmlFieldsContainer: HTMLDivElement;

  private htmlSubmitBtn: HTMLButtonElement;

  private fields: Fields;

  constructor(props: CarFormProps) {
    this.props = props;
    this.htmlElement = document.createElement("form");
    this.htmlFieldsContainer = document.createElement("div");
    this.htmlFormHeader = document.createElement("h2");
    this.htmlSubmitBtn = document.createElement("button");

    this.fields = {
      brand: new SelectField({
        name: "brand",
        label: "Markė",
        options: brands.map(({ id, title }) => ({ title, value: id })),
      }),
      model: new SelectField({
        name: "model",
        label: "Modelis",
        options: models.map(({ id, title }) => ({ title, value: id })),
      }),
      price: new TextField({
        name: "price",
        label: "Kaina",
      }),
      year: new TextField({
        name: "year",
        label: "Metai",
      }),
    };

    this.initialize();
    this.renderView();
  }

  private initialize = (): void => {
    this.htmlFormHeader.className = "h3 text-center";

    const fieldsArr = Object.values(this.fields);
    this.htmlFieldsContainer.className = "d-flex flex-column gap-2";
    this.htmlFieldsContainer.append(...fieldsArr.map((field) => field.htmlElement));

    this.htmlSubmitBtn.className = "btn btn-primary";

    this.htmlElement.className = "card d-flex flex-column gap-3 p-2";
    this.htmlElement.append(this.htmlFormHeader, this.htmlFieldsContainer, this.htmlSubmitBtn);
  };

  private handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const { onSubmit } = this.props;

    const formData = new FormData(this.htmlElement);

    const brand = formData.get("brand") as string | null;
    const model = formData.get("model") as string | null;
    const price = formData.get("price") as string | null;
    const year = formData.get("year") as string | null;

    if (!(brand && price && model && year)) {
      console.error(`Klaida ! Blogi duomenys - ${brand} ${price} ${model} ${year}`);
      return;
    }

    const formValues: Values = {
      brand,
      model,
      price,
      year,
    };

    onSubmit(formValues);
  };

  private renderView = (): void => {
    // eslint-disable-next-line object-curly-newline
    const { title, values, submitBtnText, isEdited } = this.props;

    if (isEdited) {
      this.htmlElement.classList.add("border", "border-warning", "btn-warning");
      this.htmlSubmitBtn.classList.remove("btn-success");
    } else {
      this.htmlElement.classList.remove("border", "border-warning", "btn-warning");
      this.htmlSubmitBtn.classList.add("btn-success");
    }

    this.htmlFormHeader.innerHTML = title;

    this.htmlSubmitBtn.innerHTML = submitBtnText;

    const valuesKeyValueArr = Object.entries(values) as [keyof Values, string][];
    valuesKeyValueArr.forEach(([fieldName, fieldValue]) => {
      const field = this.fields[fieldName];
      field.updateProps({
        value: fieldValue,
      });
    });

    this.htmlElement.addEventListener("submit", this.handleSubmit);
  };

  public updateProps = (newProps: Partial<CarFormProps>): void => {
    this.props = {
      ...this.props,
      ...newProps,
    };

    this.renderView();
  };
}

export default CarForm;
