import { render } from "@testing-library/react";
import App from "../components/App";

test("Renders correctly the app", () => {
  const { unmount } = render(<App />);
  unmount();
});
