import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";

test("renders app header title", () => {
  render(<Header />);
  expect(screen.getByText(/mini wallet/i)).toBeInTheDocument();
});
