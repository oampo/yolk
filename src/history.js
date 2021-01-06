export function create() {
  return {
    array: [],
    position: 0,
  };
}

// Add an action to the top of the undo stack
function add(history, action) {
  const array = [...history.array, action];
  return {
    ...history,
    array,
  };
}

// Replace the item on top of the undo stack
function replace(history, action) {
  const array = [...history.array.slice(0, history.array.length - 1), action];
  return {
    ...history,
    array,
  };
}

// Try to merge an actions into the action at the top of the undo stack
// If we can't merge it, add it to the end of the history
function mergeOrAdd(history, action) {
  if (history.position === 0) {
    // Nothing to merge the new action into
    return add(history, action);
  }

  const last = peek(history);
  if (last.type !== action.type) {
    // We can only merge if the actions are the same
    return add(history, action);
  }

  switch (action.type) {
    case RESIZE: {
      return replace(history, { ...last, toChart: action.toChart });
    }
    case SET_COLOR: {
      if (action.id === last.id) {
        return replace(history, { ...last, toColor: action.toColor });
      }
      break;
    }
    default:
      return add(history, action);
  }
  return add(history, action);
}

export function push(history, action) {
  // Remove the undo history ahead of this point - our histories have diverged
  const array = history.array.slice(0, history.position);
  const newHistory = mergeOrAdd({ ...history, array }, action);
  newHistory.position = newHistory.array.length;
  return newHistory;
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
      position,
    },
  ];
}

export function peek(history) {
  if (history.position === 0) {
    return null;
  }

  return history.array[history.position - 1];
}

export function advance(history) {
  if (history.postion === history.array.length) {
    return [null, history];
  }
  const value = history.array[history.position];
  const position = history.position + 1;
  return [value, { array: history.array, position }];
}

export const RESIZE = "RESIZE";
export function resize(fromChart, toChart) {
  return {
    type: RESIZE,
    fromChart,
    toChart,
  };
}

export const SET_STITCHES = "SET_STITCHES";
export function setStitches(stitches) {
  return {
    type: SET_STITCHES,
    stitches,
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

export const FLIP = "FLIP";
export function flip() {
  return {
    type: FLIP,
  };
}
