import React from "react";
import "./YokeView.scss";

// Middle quarter of the yoke is blank
const START_RADIUS = 0.25;
// Minimum row size is one of ten rows
const MIN_STROKE_WIDTH = (1 - START_RADIUS) / 10;
const BOUNDS_STROKE_WIDTH = 0.01;

export default function YokeView(props) {
  const { chart, colors, numRepeats, direction } = props;

  function createStitch(stitch, stitchIndex, numColumns, rowIndex, numRows) {
    const segmentAngle = (2 * Math.PI) / numRepeats;
    const stitchAngle = segmentAngle / numColumns;
    const stitchStartAngle = stitchIndex * stitchAngle;
    const stitchEndAngle = stitchStartAngle + stitchAngle;
    const strokeWidth = Math.min(
      (1 - START_RADIUS) / numRows,
      MIN_STROKE_WIDTH
    );
    const rowRadius = START_RADIUS + rowIndex * strokeWidth;

    const startX = rowRadius * Math.sin(stitchStartAngle);
    const startY = rowRadius * Math.cos(stitchStartAngle);

    const endX = rowRadius * Math.sin(stitchEndAngle);
    const endY = rowRadius * Math.cos(stitchEndAngle);

    const d = `M ${startX} ${startY} A ${rowRadius} ${rowRadius} 1 0 ${endX} ${endY}`;
    return (
      <path
        key={stitchIndex}
        d={d}
        stroke={colors[stitch]}
        strokeWidth={strokeWidth}
      />
    );
  }

  function createSegment() {
    let directionalChart = chart;
    if (direction === 'top-down') {
      directionalChart = chart.slice().reverse();
    }
    return directionalChart.map((row, rowIndex) =>
      row
        .slice()
        .reverse() // RTL
        .filter((stitch) => stitch !== null && colors[stitch] !== null)
        .map((stitch, columnIndex, row) =>
          createStitch(stitch, columnIndex, row.length, rowIndex, chart.length)
        )
    );
  }

  function createSegments() {
    const segments = [];
    for (let i = 0; i < numRepeats; i++) {
      const rotation = (i / numRepeats) * 360;
      segments.push(
        <g key={i} transform={`rotate(${rotation})`}>
          {createSegment()}
        </g>
      );
    }
    return segments;
  }

  function createBounds(numRows) {
    const rowStrokeWidth = Math.min(
      (1 - START_RADIUS) / numRows,
      MIN_STROKE_WIDTH
    );
    const minRadius = START_RADIUS - rowStrokeWidth / 2 - BOUNDS_STROKE_WIDTH;
    const maxRadius = minRadius + rowStrokeWidth * numRows;
    return (
      <>
        <circle
          cx="0"
          cy="0"
          r={maxRadius}
          stroke="black"
          strokeWidth={BOUNDS_STROKE_WIDTH}
          fill="none"
        />
        <circle
          cx="0"
          cy="0"
          r={minRadius}
          stroke="black"
          strokeWidth={BOUNDS_STROKE_WIDTH}
          fill="none"
        />
      </>
    );
  }

  return (
    <section className="yoke-view">
      <div className="yoke-view-image-wrapper">
        <svg
          className="yoke-view-image"
          viewBox="-1 -1 2 2"
          preserveAspectRatio="xMidYMin meet"
        >
          {createSegments()}
          {createBounds(chart.length)}
        </svg>
      </div>
    </section>
  );
}
