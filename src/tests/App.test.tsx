import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { act, render, screen } from "@testing-library/react";
import { v4 as uuid } from "uuid";
import App from "../components/App";
import store from "../stores/MainStore";
import BoxModel from "../stores/models/Box";

const BASE_SNAPSHOT = getSnapshot(store);

afterEach(() => {
  applySnapshot(store, BASE_SNAPSHOT);
});

const renderApp = () => render(<App />);

describe("App", () => {
  it("renders the add-box control", () => {
    renderApp();
    expect(screen.getByRole("button", { name: /add box/i })).toBeInTheDocument();
  });

  it("renders the remove-box control", () => {
    renderApp();
    expect(screen.getByRole("button", { name: /remove box/i })).toBeInTheDocument();
  });

  it("renders the color picker with an accessible name", () => {
    renderApp();
    expect(screen.getByLabelText(/box color/i)).toBeInTheDocument();
  });

  it("displays the selection summary", () => {
    renderApp();
    expect(screen.getByText(/no boxes selected/i)).toBeInTheDocument();
  });

  it("renders the initial box on the canvas", () => {
    renderApp();
    expect(screen.getAllByText(/^box$/i)).toHaveLength(1);
  });

  it("reflects new boxes added to the store", async () => {
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
});
