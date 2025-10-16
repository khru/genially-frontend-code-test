import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { v4 as uuid } from "uuid";
import App from "../../components/App";
import store from "../../stores/MainStore";
import { DEFAULT_POSITION } from "../../domain/BoxFactory";
import BoxModel from "../../stores/models/Box";
import { DragEvent } from "../../domain/DragPort";
import { DragAdapterProvider } from "../../ui/DragAdapterProvider";
import { createMockDragAdapter } from "../helpers/createMockDragAdapter";

const BASE_SNAPSHOT = getSnapshot(store);

const createDragEvent = (overrides: Partial<DragEvent>, element: Element): DragEvent => ({
  dx: 0,
  dy: 0,
  target: element,
  ...overrides,
});

describe("App", () => {
  let dragMock: ReturnType<typeof createMockDragAdapter>;

  const renderApp = () => {
    dragMock = createMockDragAdapter();
    render(
      <DragAdapterProvider service={dragMock.adapter}>
        <App />
      </DragAdapterProvider>,
    );
  };

  afterEach(() => {
    dragMock.reset();
    act(() => {
      applySnapshot(store, BASE_SNAPSHOT);
    });
  });

  it("should render add box control when the app mounts then the button is visible", () => {
    renderApp();
    expect(screen.getByRole("button", { name: /add box/i })).toBeInTheDocument();
  });

  it("should render remove box control when the app mounts then the button is visible", () => {
    renderApp();
    expect(screen.getByRole("button", { name: /remove box/i })).toBeInTheDocument();
  });

  it("should expose a named color picker when the toolbar renders then the input is accessible", () => {
    renderApp();
    expect(screen.getByLabelText(/box color/i)).toBeInTheDocument();
  });

  it("should show selection summary when nothing is selected then the default message is present", () => {
    renderApp();
    expect(screen.getByText(/no boxes selected/i)).toBeInTheDocument();
  });

  it("should list one box when the store is seeded then the canvas shows exactly one entry", () => {
    renderApp();
    expect(screen.getAllByText(/^box$/i)).toHaveLength(1);
  });

  it("should reflect new boxes when the store adds one then the canvas renders the additional box", async () => {
    renderApp();
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
    renderApp();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add box/i }));

    const boxes = await screen.findAllByText(/^box$/i);
    const latestBox = store.boxes[store.boxes.length - 1];

    expect(boxes).toHaveLength(2);
    expect(latestBox.left).toBe(DEFAULT_POSITION.left);
    expect(latestBox.top).toBe(DEFAULT_POSITION.top);
  });

  it("should decorate the box with selection when the user clicks the box then the selection state is true", async () => {
    renderApp();
    const user = userEvent.setup();
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];

    await user.click(boxElement);

    expect(boxElement).toHaveAttribute("aria-pressed", "true");
  });

  it("should clear the selection when the user clicks on the canvas then the box loses the selection class", async () => {
    renderApp();
    const user = userEvent.setup();
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];
    await user.click(boxElement);

    await user.click(screen.getByTestId("canvas"));

    expect(boxElement).toHaveAttribute("aria-pressed", "false");
  });

  it("should update the selected box color when the user picks a new color then the box reflects the change", async () => {
    renderApp();
    const user = userEvent.setup();
    const colorInput: HTMLInputElement = screen.getByLabelText(/box color/i);
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];
    const color = "#ff00ff";

    await user.click(boxElement);

    // Use fireEvent because <input type="color"> lacks full userEvent support.
    fireEvent.input(colorInput, { target: { value: color } });

    expect(colorInput.value).toBe(color);
    expect(boxElement).toHaveStyle({ backgroundColor: color });
    expect(store.boxes[0].color).toBe(color);
  });

  it("should update the color control when the user selects another box then the picker mirrors that box color", async () => {
    renderApp();
    const user = userEvent.setup();
    const colorInput: HTMLInputElement = screen.getByLabelText(/box color/i);
    const secondBoxColor = "#123456";

    act(() => {
      store.addBox(
        BoxModel.create({
          id: uuid(),
          color: secondBoxColor,
          left: 50,
          top: 60,
        }),
      );
    });

    const boxElements = screen.getAllByRole("button", { name: /^box$/i });

    await user.click(boxElements[0]);
    fireEvent.input(colorInput, { target: { value: "#abcdef" } });
    await user.click(boxElements[1]);

    expect(colorInput.value).toBe(secondBoxColor);
    expect(store.boxes[1].color).toBe(secondBoxColor);
  });

  it("should persist the new position when the user finishes dragging then the store reflects the latest coordinates", async () => {
    renderApp();
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];
    const axisX = 12;
    const axisY = 8;

    await waitFor(() => expect(dragMock.hasListeners(boxElement)).toBe(true));
    act(() => {
      dragMock.triggerStart(boxElement, createDragEvent({}, boxElement));
      dragMock.triggerMove(boxElement, createDragEvent({ dx: axisX, dy: axisY }, boxElement));
    });
    act(() => {
      dragMock.triggerEnd(boxElement, createDragEvent({}, boxElement));
    });

    expect(store.boxes[0].left).toBe(axisX);
    expect(store.boxes[0].top).toBe(axisY);
    expect(boxElement).toHaveStyle({ transform: `translate(${axisX}px, ${axisY}px)` });
  });

  it("should remove the selected box when the user presses remove box then the element disappears", async () => {
    renderApp();
    const user = userEvent.setup();
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];

    await user.click(boxElement);
    await user.click(screen.getByRole("button", { name: /remove box/i }));

    expect(screen.queryByRole("button", { name: /^box$/i })).not.toBeInTheDocument();
    expect(store.boxes).toHaveLength(0);
  });

  it("should remove all selected boxes when the user presses remove box then the selection summary resets", async () => {
    renderApp();
    const user = userEvent.setup();

    act(() => {
      store.addBox(
        BoxModel.create({
          id: uuid(),
          color: "#abcdef",
          left: 80,
          top: 120,
        }),
      );
    });

    const boxElements = screen.getAllByRole("button", { name: /^box$/i });

    await user.click(boxElements[0]);
    await user.click(boxElements[1]);
    await user.click(screen.getByRole("button", { name: /remove box/i }));

    expect(screen.queryAllByRole("button", { name: /^box$/i })).toHaveLength(0);
    expect(screen.getByText(/no boxes selected/i)).toBeInTheDocument();
    expect(store.boxes).toHaveLength(0);
  });

  it("should reset the canvas when clicking the reset button then the canvas have default box", async () => {
    renderApp();
    const user = userEvent.setup();
    act(() => {
      store.addBox(
        BoxModel.create({
          id: uuid(),
          color: "#abcdef",
          left: 80,
          top: 120,
        }),
      );
    });
    const boxButtons = screen.getAllByRole("button", { name: /^box$/i });
    await user.click(boxButtons[0]);

    const boxes = await screen.findAllByText(/^box$/i);
    expect(boxes).toHaveLength(2);

    const resetButton = screen.getByRole("button", { name: /^reset$/i });
    await user.click(resetButton);

    const finalBoxes = await screen.findAllByText(/^box$/i);
    expect(finalBoxes).toHaveLength(1);
  });
});
