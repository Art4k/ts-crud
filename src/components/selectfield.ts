type OptionType = {
  title: string;
  value: string;
};

export type SelectFieldProps = {
  label: string;
  onChange: (newValue: string) => void;
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
    this.htmlElement = document.createElement("div");
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

    this.htmlElement.className = "form-group";
    this.htmlElement.append(this.htmlLabelElement, this.htmlSelectElement);
  };

  private renderView = (): void => {
    const { label, onChange } = this.props;

    this.htmlLabelElement.innerHTML = label;
    this.htmlSelectElement.addEventListener("change", () => onChange(this.htmlSelectElement.value));
    this.renderSelectOptions();
  };

  private renderSelectOptions = (): void => {
    const { options } = this.props;

    const optionsHtmlElements = options.map((option) => {
      const element = document.createElement("option");
      element.innerHTML = option.title;
      element.value = option.value;

      return element;
    });

    this.htmlSelectElement.innerHTML = "";
    this.htmlSelectElement.append(...optionsHtmlElements);
  };
}

export default SelectField;