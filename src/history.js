export function create() {
  return {
    array: [],
    position: 0,
  };
}

export function push(history, item) {
  const array = [...history.array.slice(0, history.position), item];
  const position = array.length;
  return {
    array,
    position,
  };
}

export function pop(history) {
  if (history.position === 0) {
    return [null, history];
  }

  const value = history.array[history.position - 1];
  const position = history.position - 1;
  return [
    value,
    {
      array: history.array,
      position
    },
  ];
}

export function peek(history) {
  if (history.position === 0) {
    return null;
  }

  return history[history.position - 1];
}

export const RESIZE = "RESIZE";
export function resize(fromRows, fromColumns, toRows, toColumns) {
  return {
    type: RESIZE,
    fromRows,
    fromColumns,
    toRows,
    toColumns,
  };
}

export const SET_STITCH = "SET_STITCH";
export function setStitch(row, column, fromColor, toColor) {
  return {
    type: SET_STITCH,
    row,
    column,
    fromColor,
    toColor,
  };
}

export const SET_COLOR = "SET_COLOR";
export function setColor(id, fromColor, toColor) {
  return {
    type: SET_COLOR,
    id,
    fromColor,
    toColor,
  };
}

export const ADD_COLOR = "ADD_COLOR";
export function addColor(id) {
  return {
    type: ADD_COLOR,
    id,
  };
}

export const DELETE_COLOR = "DELETE_COLOR";
export function deleteColor(id, color) {
  return {
    type: DELETE_COLOR,
    id,
    color,
  };
}
