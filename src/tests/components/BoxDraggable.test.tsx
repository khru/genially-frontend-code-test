import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoxDraggable, { BoxDraggableProps } from "../../components/BoxDraggable";
import { DragEvent, DragServiceProvider } from "../../services/drag";
import { createMockDragService } from "../testUtils/createMockDragService";

const createDragEvent = (overrides: Partial<DragEvent>, element: Element): DragEvent => ({
  dx: 0,
  dy: 0,
  target: element,
  ...overrides,
});

const minimalProps: BoxDraggableProps = {
  id: "box-1",
  color: "#ffffff",
  width: 100,
  height: 60,
  left: 10,
  top: 20,
  isSelected: false,
  onSelect: jest.fn(),
  onDragStart: jest.fn(),
  onDragMove: jest.fn(),
  onDragEnd: jest.fn(),
};

describe("BoxDraggable", () => {
  let dragMock: ReturnType<typeof createMockDragService>;

  beforeEach(() => {
    dragMock = createMockDragService();
  });

  afterEach(() => {
    dragMock.reset();
  });

  it("should invoke onSelect when the user clicks the box then the callback receives the id", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(
      <DragServiceProvider service={dragMock.service}>
        <BoxDraggable {...minimalProps} onSelect={onSelect}>
          <span>content</span>
        </BoxDraggable>
      </DragServiceProvider>,
    );

    await user.click(screen.getByRole("button", { name: /content/i }));

    expect(onSelect).toHaveBeenCalledWith("box-1");
  });

  it("should expose aria-pressed true when the box is selected then the accessibility state matches", () => {
    render(
      <DragServiceProvider service={dragMock.service}>
        <BoxDraggable {...minimalProps} isSelected>
          <span>content</span>
        </BoxDraggable>
      </DragServiceProvider>,
    );

    expect(screen.getByRole("button", { name: /content/i })).toHaveAttribute("aria-pressed", "true");
  });

  it("should apply transform and sizing styles based on props then the element reflects positioning", () => {
    render(
      <DragServiceProvider service={dragMock.service}>
        <BoxDraggable {...minimalProps}>
          <span>content</span>
        </BoxDraggable>
      </DragServiceProvider>,
    );

    const element = screen.getByRole("button", { name: /content/i });
    expect(element).toHaveStyle({ transform: "translate(10px, 20px)", width: "100px", height: "60px" });
  });

  it("should start dragging without requiring prior selection when the pointer engages then the drag handler runs", () => {
    const onDragStart = jest.fn();
    const onSelect = jest.fn();
    render(
      <DragServiceProvider service={dragMock.service}>
        <BoxDraggable {...minimalProps} isSelected={false} onDragStart={onDragStart} onSelect={onSelect}>
          <span>content</span>
        </BoxDraggable>
      </DragServiceProvider>,
    );

    const element = screen.getByRole("button", { name: /content/i });

    act(() => {
      dragMock.triggerStart(element, createDragEvent({}, element));
    });

    expect(onDragStart).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("should update the transform while dragging when the pointer moves then the box follows the pointer", async () => {
    const onDragMove = jest.fn();
    render(
      <DragServiceProvider service={dragMock.service}>
        <BoxDraggable {...minimalProps} left={5} top={6} onDragMove={onDragMove}>
          <span>content</span>
        </BoxDraggable>
      </DragServiceProvider>,
    );

    const element = screen.getByRole("button", { name: /content/i });
    await waitFor(() => expect(dragMock.hasListeners(element)).toBe(true));
    act(() => {
      dragMock.triggerStart(element, createDragEvent({}, element));
      dragMock.triggerMove(element, createDragEvent({ dx: 10, dy: 15 }, element));
    });

    expect(element).toHaveStyle({ transform: "translate(15px, 21px)" });
    expect(onDragMove).toHaveBeenCalledWith({ left: 15, top: 21 });
  });

  it("should persist the new position when dragging ends then the callback receives the final coordinates", async () => {
    const onDragEnd = jest.fn();
    render(
      <DragServiceProvider service={dragMock.service}>
        <BoxDraggable {...minimalProps} left={2} top={4} onDragEnd={onDragEnd}>
          <span>content</span>
        </BoxDraggable>
      </DragServiceProvider>,
    );

    const element = screen.getByRole("button", { name: /content/i });
    await waitFor(() => expect(dragMock.hasListeners(element)).toBe(true));
    act(() => {
      dragMock.triggerStart(element, createDragEvent({}, element));
      dragMock.triggerMove(element, createDragEvent({ dx: 3, dy: 6 }, element));
    });
    act(() => {
      dragMock.triggerEnd(element, createDragEvent({}, element));
    });

    expect(onDragEnd).toHaveBeenCalledWith({ left: 5, top: 10 });
  });
});
