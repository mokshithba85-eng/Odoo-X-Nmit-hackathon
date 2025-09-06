import { render, screen } from "@testing-library/react";
import Feed from "../pages/index";

describe("Feed Page", () => {
  it("renders search input", () => {
    render(<Feed />);
    expect(screen.getByPlaceholderText("Search title...")).toBeInTheDocument();
  });
});
