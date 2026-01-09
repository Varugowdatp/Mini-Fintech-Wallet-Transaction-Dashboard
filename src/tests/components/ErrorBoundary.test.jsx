import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../../components/ErrorBoundary";

function Bomb() {
  throw new Error("Crash");
}

test("shows fallback UI on error", () => {
  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );

  expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
});
