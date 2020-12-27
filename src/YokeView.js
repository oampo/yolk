import React from "react";

export default class YokeView extends React.Component {
  state = {
    segments: 15,
  };

  createStitch(stitch, stitchIndex, numColumns, rowIndex, numRows) {
    const segmentAngle = (2 * Math.PI) / this.state.segments;
    const stitchAngle = segmentAngle / numColumns;
    const stitchStartAngle = stitchIndex * stitchAngle;
    const stitchEndAngle = stitchStartAngle + stitchAngle;
    const startRadius = 0.25;
    const strokeWidth = (1 - startRadius) / numRows;
    const rowRadius = startRadius + rowIndex * strokeWidth;

    const startX = rowRadius * Math.sin(stitchStartAngle);
    const startY = rowRadius * Math.cos(stitchStartAngle);

    const endX = rowRadius * Math.sin(stitchEndAngle);
    const endY = rowRadius * Math.cos(stitchEndAngle);

    const d = `M ${startX} ${startY} A ${rowRadius} ${rowRadius} 1 0 ${endX} ${endY}`;
    //const d = `M ${startX} ${startY} L ${endX} ${endY}`;
    return (
      <path
        key={stitchIndex}
        d={d}
        stroke={this.props.colors[stitch.color]}
        strokeWidth={strokeWidth}
      />
    );
  }

  createSegment() {
    return this.props.chart.map((row, rowIndex) =>
      row
        .slice()
        .reverse() // RTL
        .filter((stitch) => stitch !== null)
        .map((stitch, columnIndex, row) =>
          this.createStitch(
            stitch,
            columnIndex,
            row.length,
            rowIndex,
            this.props.chart.length
          )
        )
    );
  }

  createSegments() {
    const segments = [];
    for (let i = 0; i < this.state.segments; i++) {
      const rotation = (i / this.state.segments) * 360;
      segments.push(
        <g key={i} transform={`rotate(${rotation})`}>
          {this.createSegment()}
        </g>
      );
    }
    return segments;
  }

  render() {
    return (
      <svg className="yoke-view" viewBox="-1 -1 2 2" width="500" height="500">
        {this.createSegments()}
      </svg>
    );
  }
}
