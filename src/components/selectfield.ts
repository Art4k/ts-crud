type OptionType = {
  title: string;
  value: string;
};

export type SelectFieldProps = {
  label: string;
  onChange: (newValue: string) => void;
  name?: string;
  value?: string;
  options: Array<OptionType>;
};

class SelectField {
  private static uniqueId = 0;

  private props: SelectFieldProps;

  private htmlSelectElement: HTMLSelectElement;

  private htmlLabelElement: HTMLLabelElement;

  public htmlElement: HTMLDivElement;

  constructor(props: SelectFieldProps) {
    this.props = props;

    SelectField.uniqueId += 1;

    this.htmlElement = document.createElement("div");
    this.htmlElement.innerHTML = "<h3> Filtravimas </h3>";
    this.htmlSelectElement = document.createElement("select");
    this.htmlLabelElement = document.createElement("label");

    this.initialize();
    this.renderView();
  }

  private initialize = (): void => {
    const elementId = `select-${SelectField.uniqueId}`;

    this.htmlLabelElement.setAttribute("for", elementId);

    this.htmlSelectElement.className = "form-select";
    this.htmlSelectElement.id = elementId;

    this.htmlElement.className = "form-group col-3 px-4";
    this.htmlElement.append(this.htmlLabelElement, this.htmlSelectElement);
  };

  private renderView = (): void => {
    const { label, onChange, name } = this.props;

    this.htmlLabelElement.innerHTML = label;
    if (onChange) {
      this.htmlSelectElement.addEventListener("change", () => onChange(this.htmlSelectElement.value));
    }
    if (name) {
      this.htmlSelectElement.name = name;
    }
    this.renderSelectOptions();
  };

  private renderSelectOptions = (): void => {
    const { options, value } = this.props;

    const optionsHtmlElements = options.map((option) => {
      const element = document.createElement("option");
      element.innerHTML = option.title;
      element.value = option.value;
      element.selected = option.value === value;

      return element;
    });

    this.htmlSelectElement.innerHTML = "";
    this.htmlSelectElement.append(...optionsHtmlElements);
  };

  public updateProps = (newProps: Partial<SelectFieldProps>): void => {
    this.props = {
      ...this.props,
      ...newProps,
    };

    this.renderView();
  };
}

export default SelectField;
