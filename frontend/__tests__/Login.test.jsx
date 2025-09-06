import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/auth/login";

describe("Login Page", () => {
  it("shows login title", () => {
    render(<Login />);
    expect(screen.getByText(/Login to ECOFINDS/i)).toBeInTheDocument();
  });

  it("can switch mode", () => {
    render(<Login />);
    fireEvent.click(screen.getByText(/Switch/i));
    expect(screen.getByText(/Sign up for ECOFINDS/i)).toBeInTheDocument();
  });
});
