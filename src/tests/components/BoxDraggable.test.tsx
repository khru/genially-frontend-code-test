import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoxDraggable, { BoxDraggableProps } from "../../components/BoxDraggable";

const minimalProps: BoxDraggableProps = {
  id: "box-1",
  color: "#ffffff",
  width: 100,
  height: 60,
  left: 10,
  top: 20,
  isSelected: false,
  onSelect: jest.fn(),
};

describe("BoxDraggable", () => {
  it("should invoke onSelect when the user clicks the box then the callback receives the id", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(
      <BoxDraggable {...minimalProps} onSelect={onSelect}>
        <span>content</span>
      </BoxDraggable>,
    );

    await user.click(screen.getByRole("button", { name: /content/i }));

    expect(onSelect).toHaveBeenCalledWith("box-1");
  });

  it("should expose aria-pressed true when the box is selected then the accessibility state matches", () => {
    render(
      <BoxDraggable {...minimalProps} isSelected>
        <span>content</span>
      </BoxDraggable>,
    );

    expect(screen.getByRole("button", { name: /content/i })).toHaveAttribute("aria-pressed", "true");
  });

  it("should apply transform and sizing styles based on props then the element reflects positioning", () => {
    render(
      <BoxDraggable {...minimalProps}>
        <span>content</span>
      </BoxDraggable>,
    );

    const element = screen.getByRole("button", { name: /content/i });
    expect(element).toHaveStyle({ transform: "translate(10px, 20px)", width: "100px", height: "60px" });
  });
});
