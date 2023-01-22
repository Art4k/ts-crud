export type TextFieldProps = {
  labelText: string;
  name: string;
  value?: string;
};

class TextField {
  private static uniqueId = 0;

  private static get id() {
    return `${this.name}-${this.uniqueId}`;
  }

  private props: TextFieldProps;

  private htmlInputElement: HTMLInputElement;

  private htmlLabelElement: HTMLLabelElement;

  public htmlElement: HTMLDivElement;

  constructor(props: TextFieldProps) {
    TextField.uniqueId += 1;
    this.props = props;

    this.htmlElement = document.createElement("div");
    this.htmlLabelElement = document.createElement("label");
    this.htmlInputElement = document.createElement("input");

    this.initialize();
    this.renderView();
  }

  private initialize = (): void => {
    const inputId = `input-${TextField.id}`;

    this.htmlLabelElement.setAttribute("for", inputId);
    this.htmlLabelElement.className = "form-label";

    this.htmlInputElement.id = inputId;
    this.htmlInputElement.className = "form-control";
    this.htmlInputElement.type = "text";

    this.htmlElement.append(this.htmlLabelElement, this.htmlInputElement);
  };

  private renderView = (): void => {
    const { name, labelText, value } = this.props;

    this.htmlLabelElement.innerHTML = labelText;
    this.htmlInputElement.name = name;
    if (value) {
      this.htmlInputElement.value = value;
    }
  };

  public updateProps = (newProps: Partial<TextFieldProps>): void => {
    this.props = {
      ...this.props,
      ...newProps,
    };

    this.renderView();
  };
}

export default TextField;
