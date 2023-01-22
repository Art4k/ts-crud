type RowData = {
  id: string;
  [key: string]: string;
};

export type TableProps<Type> = {
  title: string;
  columns: Type;
  rowsData: Type[];
  editedCarId: string | null;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

class Table<Type extends RowData> {
  public htmlElement: HTMLTableElement;

  private props: TableProps<Type>;

  private tbody: HTMLTableSectionElement;

  private thead: HTMLTableSectionElement;

  public constructor(props: TableProps<Type>) {
    this.props = props;
    this.checkColumnsCompatability();
    this.htmlElement = document.createElement("table");
    this.thead = document.createElement("thead");
    this.tbody = document.createElement("tbody");

    this.initialize();
  }

  private checkColumnsCompatability = (): void => {
    const { rowsData, columns } = this.props;

    if (this.props.rowsData.length === 0) return;
    const columnCount = Object.keys(columns).length;

    const columnsCompatableWithRowsData = rowsData.every((row) => {
      const rowCellsCount = Object.keys(row).length;

      return rowCellsCount === columnCount;
    });

    if (!columnsCompatableWithRowsData) {
      throw new Error("Nesutampa lentelės stulpelių skaičius su eilučių stulpelių skaičiumi");
    }
  };

  private initializeHead = (): void => {
    const { title, columns } = this.props;

    const headersArray = Object.values(columns);
    const headersRowHtmlString = headersArray.map((header) => `<th>${header}</th>`).join("");

    this.thead.innerHTML = `
      <tr>
        <th colspan="${headersArray.length}" class="text-center h3">${title}</th>
      </tr>
      <tr>${headersRowHtmlString}</tr>
    `;
  };

  private initializeBody = (): void => {
    const { rowsData, columns, editedCarId } = this.props;

    this.tbody.innerHTML = "";
    const rowsHtmlElements = rowsData.map((rowData) => {
      const rowHtmlElement = document.createElement("tr");

      if (editedCarId === rowData.id) {
        rowHtmlElement.style.backgroundColor = "#bef8fa";
      }

      const cellsHtmlString = Object.keys(columns)
        .map((key) => `<td>${rowData[key]}</td>`)
        .join(" ");

      rowHtmlElement.innerHTML = cellsHtmlString;

      this.addActionsCell(rowHtmlElement, rowData.id);

      return rowHtmlElement;
    });

    this.tbody.append(...rowsHtmlElements);
  };

  private initialize = (): void => {
    this.initializeHead();
    this.initializeBody();

    this.htmlElement.className = "table table-striped order border";
    this.htmlElement.append(this.thead, this.tbody);
  };

  private renderView = (): void => {
    this.initialize();
  };

  private addActionsCell = (tr: HTMLTableRowElement, id: string) => {
    const { onDelete, onEdit, editedCarId } = this.props;

    const buttonCell = document.createElement("td");
    buttonCell.className = "d-flex justify-content-center gap-3";

    const isCancelButton = editedCarId === id;
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.innerHTML = isCancelButton ? "Cancel" : "Edit";
    editButton.className = `btn btn-${isCancelButton ? "dark" : "warning"}`;
    editButton.style.width = "80px";
    editButton.addEventListener("click", () => onEdit(id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.innerHTML = "Delete";
    deleteButton.className = "btn btn-danger";
    deleteButton.style.width = "80px";
    deleteButton.addEventListener("click", () => onDelete(id));

    buttonCell.append(editButton, deleteButton);
    tr.append(buttonCell);
  };

  public updateProps = (newProps: Partial<TableProps<Type>>): void => {
    this.props = {
      ...this.props,
      ...newProps,
    };

    this.renderView();
  };
}

export default Table;
