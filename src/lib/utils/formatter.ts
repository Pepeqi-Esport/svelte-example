function formatNumber(value: number) {
  if (value) {
    let valueString = String(value).replaceAll(".", "");
    let valueNumber = Number(valueString);

    if (Number.isNaN(valueNumber) || (valueString.length > 1 && valueString.startsWith("0"))) {
      return "";
    }

    return valueString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}

function formatNumberElement(element: any) {
  if (element.value) {
    let valueString = String(element.value).replaceAll(".", "");
    let valueNumber = Number(valueString);

    if (Number.isNaN(valueNumber) || (valueString.length > 1 && valueString.startsWith("0"))) {
      element.value = "0";
      return;
    }

    element.value = valueString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}

export { formatNumber, formatNumberElement };