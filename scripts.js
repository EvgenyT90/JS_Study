function convertTemperature(value, unit) {
  if (unit === "Celsius") {
    return (value * 9) / 5 + 32;
  } else if (unit === "Fahrenheit") {
    return ((value - 32) * 5) / 9;
  }
}

document
  .getElementById("temperature-input")
  .addEventListener("change", function () {
    const temperature = parseFloat(this.value);
    const unit = document.getElementById("unit-select").value;
    const convertedTemperature = convertTemperature(temperature, unit);
    document.getElementById("result").innerHTML =
      convertedTemperature.toFixed(5);
  });

document.getElementById("unit-select").addEventListener("change", function () {
  const temperature = parseFloat(
    document.getElementById("temperature-input").value
  );
  const unit = this.value;
  const convertedTemperature = convertTemperature(temperature, unit);
  document.getElementById("result").innerHTML = convertedTemperature.toFixed(5);
});
