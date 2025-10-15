import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { v4 as uuid } from "uuid";
import App from "../../components/App";
import store from "../../stores/MainStore";
import { DEFAULT_POSITION } from "../../application/BoxService";
import BoxModel from "../../stores/models/Box";

const BASE_SNAPSHOT = getSnapshot(store);

afterEach(() => {
  applySnapshot(store, BASE_SNAPSHOT);
});

/* eslint-disable testing-library/no-render-in-lifecycle */
beforeEach(() => {
  render(<App />);
});

describe("App", () => {
  it("should render add box control when the app mounts then the button is visible", () => {
    expect(screen.getByRole("button", { name: /add box/i })).toBeInTheDocument();
  });

  it("should render remove box control when the app mounts then the button is visible", () => {
    expect(screen.getByRole("button", { name: /remove box/i })).toBeInTheDocument();
  });

  it("should expose a named color picker when the toolbar renders then the input is accessible", () => {
    expect(screen.getByLabelText(/box color/i)).toBeInTheDocument();
  });

  it("should show selection summary when nothing is selected then the default message is present", () => {
    expect(screen.getByText(/no boxes selected/i)).toBeInTheDocument();
  });

  it("should list one box when the store is seeded then the canvas shows exactly one entry", () => {
    expect(screen.getAllByText(/^box$/i)).toHaveLength(1);
  });

  it("should reflect new boxes when the store adds one then the canvas renders the additional box", async () => {
    act(() => {
      store.addBox(
        BoxModel.create({
          id: uuid(),
          color: "#ABCDEF",
          left: 10,
          top: 20,
        }),
      );
    });

    const boxes = await screen.findAllByText(/^box$/i);
    expect(boxes).toHaveLength(2);
  });

  it("should show a second box when the user clicks add box then the canvas lists the new element", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /add box/i }));

    const boxes = await screen.findAllByText(/^box$/i);
    expect(boxes).toHaveLength(2);
    const latestBox = store.boxes[store.boxes.length - 1];
    expect(latestBox.left).toBe(DEFAULT_POSITION.left);
    expect(latestBox.top).toBe(DEFAULT_POSITION.top);
  });

  it("should decorate the box with selection when the user clicks the box then the selection state is true", async () => {
    const user = userEvent.setup();
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];

    await user.click(boxElement);

    expect(boxElement).toHaveAttribute("aria-pressed", "true");
  });

  it("should clear the selection when the user clicks on the canvas then the box loses the selection class", async () => {
    const user = userEvent.setup();
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];
    await user.click(boxElement);

    await user.click(screen.getByTestId("canvas"));

    expect(boxElement).toHaveAttribute("aria-pressed", "false");
  });
});
