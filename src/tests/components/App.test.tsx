import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { v4 as uuid } from "uuid";
import App from "../../components/App";
import store from "../../stores/MainStore";
import { DEFAULT_POSITION } from "../../domain/BoxFactory";
import BoxModel from "../../stores/models/Box";
import { DragEvent } from "../../domain/DragPort";
import { DragAdapterProvider } from "../../ui/drag/DragAdapterProvider";
import { createMockDragService } from "../testUtils/createMockDragService";

const BASE_SNAPSHOT = getSnapshot(store);

const createDragEvent = (overrides: Partial<DragEvent>, element: Element): DragEvent => ({
  dx: 0,
  dy: 0,
  target: element,
  ...overrides,
});

describe("App", () => {
  let dragMock: ReturnType<typeof createMockDragService>;

  /* eslint-disable testing-library/no-render-in-lifecycle */
  beforeEach(() => {
    dragMock = createMockDragService();
    render(
      <DragAdapterProvider service={dragMock.service}>
        <App />
      </DragAdapterProvider>,
    );
  });

  afterEach(() => {
    dragMock.reset();
    act(() => {
      applySnapshot(store, BASE_SNAPSHOT);
    });
  });

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

  it("should update the selected box color when the user picks a new color then the box reflects the change", async () => {
    const user = userEvent.setup();
    const colorInput: HTMLInputElement = screen.getByLabelText(/box color/i);
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];

    await user.click(boxElement);

    // Use fireEvent because <input type="color"> lacks full userEvent support.
    fireEvent.input(colorInput, { target: { value: "#ff00ff" } });

    expect(colorInput.value).toBe("#ff00ff");
    expect(boxElement).toHaveStyle({ backgroundColor: "#ff00ff" });
    expect(store.boxes[0].color).toBe("#ff00ff");
  });

  it("should update the color control when the user selects another box then the picker mirrors that box color", async () => {
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
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];
    const initialLeft = store.boxes[0].left;
    const initialTop = store.boxes[0].top;

    await waitFor(() => expect(dragMock.hasListeners(boxElement)).toBe(true));
    act(() => {
      dragMock.triggerStart(boxElement, createDragEvent({}, boxElement));
      dragMock.triggerMove(boxElement, createDragEvent({ dx: 12, dy: 8 }, boxElement));
    });
    act(() => {
      dragMock.triggerEnd(boxElement, createDragEvent({}, boxElement));
    });

    expect(store.boxes[0].left).toBe(initialLeft + 12);
    expect(store.boxes[0].top).toBe(initialTop + 8);
    expect(boxElement).toHaveStyle({ transform: `translate(${initialLeft + 12}px, ${initialTop + 8}px)` });
  });

  it("should remove the selected box when the user presses remove box then the element disappears", async () => {
    const user = userEvent.setup();
    const boxElement = screen.getAllByRole("button", { name: /^box$/i })[0];

    await user.click(boxElement);
    await user.click(screen.getByRole("button", { name: /remove box/i }));

    expect(screen.queryByRole("button", { name: /^box$/i })).not.toBeInTheDocument();
    expect(store.boxes).toHaveLength(0);
  });

  it("should remove all selected boxes when the user presses remove box then the selection summary resets", async () => {
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
});
