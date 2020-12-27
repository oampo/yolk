import React from "react";
import "./Chart.css";

export default class Chart extends React.Component {
  handleClick(e, rowIndex, columnIndex) {
    this.props.setStitch(rowIndex, columnIndex);
  }

  handleMouseOver(e, rowIndex, columnIndex) {
    const buttonPressed =
      e.buttons !== undefined ? e.buttons : e.nativeEvent.which;
    if (buttonPressed !== 1) {
      // Left button not pressed
      return;
    }

    this.props.setStitch(rowIndex, columnIndex);
  }

  render() {
    const rows = this.props.chart.map((row, rowIndex) => {
      const stitches = row.map((stitch, columnIndex) => {
        if (!stitch) {
          return (
            <div
              key={columnIndex}
              className="chart-stitch chart-stitch-ignore"
              onMouseDown={(e) => this.handleClick(e, rowIndex, columnIndex)}
              onMouseOver={(e) =>
                this.handleMouseOver(e, rowIndex, columnIndex)
              }
            />
          );
        }

        const style = {
          backgroundColor: this.props.colors[stitch.color],
        };
        return (
          <div
            key={columnIndex}
            className="chart-stitch"
            style={style}
            onMouseDown={(e) => this.handleClick(e, rowIndex, columnIndex)}
            onMouseOver={(e) => this.handleMouseOver(e, rowIndex, columnIndex)}
          />
        );
      });

      return (
        <div className="chart-row" key={rowIndex}>
          {stitches}
        </div>
      );
    });
    return <div className="chart">{rows}</div>;
  }
}
