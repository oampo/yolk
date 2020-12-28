// Wrapping modulo
function mod(x, y) {
  return ((x % y) + y) % y;
}

export function create(length = 50) {
  return {
    array: Array(length).fill(),
    end: 0,
    length: 0,
  };
}

export function push(history, item) {
  const end = (history.end + 1) % history.array.length;
  const array = history.array.map((x, index) =>
    index === history.end ? item : x
  );
  const length = history.length + 1;
  return {
    array,
    end,
    length,
  };
}

export function pop(history) {
  if (history.length === 0) {
    return [null, history];
  }

  const end = mod(history.end - 1, history.array.length);
  const value = history.array[end];
  const length = history.length - 1;
  return [
    value,
    {
      array: history.array,
      end,
      length,
    },
  ];
}

export function peek(history) {
  const index = mod(history.end - 1, history.array.length);
  return history[index];
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
    color
  };
}
