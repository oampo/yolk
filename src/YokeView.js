import React, {useState} from 'react';

export default function YokeView(props) {
  const {chart, colors} = props;
  const [numSegments, setNumSegments] = useState(15);

  function createStitch(stitch, stitchIndex, numColumns, rowIndex, numRows) {
    const segmentAngle = (2 * Math.PI) / numSegments;
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
        stroke={colors[stitch.color]}
        strokeWidth={strokeWidth}
      />
    );
  }

  function createSegment() {
    return chart.map((row, rowIndex) =>
      row
        .slice()
        .reverse() // RTL
        .filter((stitch) => stitch !== null)
        .map((stitch, columnIndex, row) =>
          createStitch(
            stitch,
            columnIndex,
            row.length,
            rowIndex,
            chart.length
          )
        )
    );
  }

  function createSegments() {
    const segments = [];
    for (let i = 0; i < numSegments; i++) {
      const rotation = (i / numSegments) * 360;
      segments.push(
        <g key={i} transform={`rotate(${rotation})`}>
          {createSegment()}
        </g>
      );
    }
    return segments;
  }

    return (
      <svg className="yoke-view" viewBox="-1 -1 2 2" width="500" height="500">
        {createSegments()}
      </svg>
    );
}
