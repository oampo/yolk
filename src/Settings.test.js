import {
  render,
  screen,
  fireEvent,
  getAllByRole,
} from "@testing-library/react";
import App from "./App";

describe("Row input", () => {
  it("Sets the number of rows", () => {
    const newRows = 10;
    render(<App />);
    const input = screen.getByLabelText("Rows");
    fireEvent.change(input, { target: { value: newRows } });

    const chart = screen.getByTitle("chart");
    const rows = getAllByRole(chart, "row");
    expect(rows.length).toEqual(newRows);
  });

  it("Can't be set to less than two rows", () => {
    const newRows = 1;
    render(<App />);
    const input = screen.getByLabelText("Rows");
    fireEvent.change(input, { target: { value: newRows } });
    expect(input.value).toBe("2");
  });
});

describe("Stitches input", () => {
  it("Sets the number of stitches", () => {
    const newStitches = 10;
    render(<App />);
    const input = screen.getByLabelText("Stitches");
    fireEvent.change(input, { target: { value: newStitches } });

    const chart = screen.getByTitle("chart");
    const firstRow = getAllByRole(chart, "row")[0];
    const cells = getAllByRole(firstRow, "cell");
    expect(cells.length).toEqual(newStitches);
  });

  it("Can't be set to less than two stitched", () => {
    const newStitches = 1;
    render(<App />);
    const input = screen.getByLabelText("Stitches");
    fireEvent.change(input, { target: { value: newStitches } });
    expect(input.value).toBe("2");
  });
});
