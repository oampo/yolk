import React from "react";
import ColorPalette from "./ColorPalette";
import Chart from "./Chart";
import YokeView from "./YokeView";

export default class App extends React.Component {
  state = {
    colors: ["#e0e0e0", "#f4eda1"],
    selectedColor: 0,
    chart: [[null]],
    numRows: 1,
    numColumns: 1,
  };

  createRow(length) {
    return Array(length).fill(null);
  }

  setRows = (numRows) => {
    const { chart, numColumns } = this.state;
    let newChart = [];
    for (let i = 0; i < numRows; i++) {
      newChart.push(chart.length > i ? chart[i] : this.createRow(numColumns));
    }
    this.setState({
      numRows,
      chart: newChart,
    });
  };

  setColumns = (numColumns) => {
    const newChart = this.state.chart.map((row) =>
      row.length > numColumns
        ? row.slice(0, numColumns)
        : [...row, ...this.createRow(numColumns - row.length)]
    );

    this.setState({
      numColumns,
      chart: newChart,
    });
  };

  setStitch = (rowIndex, columnIndex) => {
    const newChart = this.state.chart.map((row, index) => {
      if (index !== rowIndex) {
        return row;
      }
      return row.map((stitch, index) => {
        if (index !== columnIndex) {
          return stitch;
        }
        if (this.state.selectedColor === null) {
          return null;
        }

        return {
          color: this.state.selectedColor,
        };
      });
    });

    this.setState({ chart: newChart });
  };

  selectColor = (selectedColor) => {
    this.setState({
      selectedColor,
    });
  };

  render() {
    return (
      <div className="App">
        <form>
          <label htmlFor="rows">Rows</label>
          <input
            id="rows"
            type="number"
            min="1"
            value={this.state.numRows}
            onChange={(e) => this.setRows(Number(e.target.value))}
          />
          <label htmlFor="stitches">Stitches</label>
          <input
            id="stitches"
            type="number"
            min="1"
            value={this.state.numColumns}
            onChange={(e) => this.setColumns(Number(e.target.value))}
          />
        </form>
        <ColorPalette
          colors={this.state.colors}
          selectedColor={this.state.selectedColor}
          selectColor={this.selectColor}
        />
        <Chart
          chart={this.state.chart}
          numRows={this.state.numRows}
          numColumns={this.state.numColumns}
          colors={this.state.colors}
          setRows={this.setRows}
          setColumns={this.setColumns}
          setStitch={this.setStitch}
        />

        <YokeView chart={this.state.chart} colors={this.state.colors} />
      </div>
    );
  }
}
