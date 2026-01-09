import React from "react";
import { render, screen } from "@testing-library/react";
import AddMoneyModal from "../../components/AddMoneyModal";

test("renders add money modal when open", () => {
  render(
    <AddMoneyModal
      isOpen={true}
      onClose={() => {}}
      onSubmit={() => {}}
      isLoading={false}
    />
  );

 
  expect(
    screen.getByRole("heading", { name: /add money/i })
  ).toBeInTheDocument();

   
  expect(
    screen.getByRole("button", { name: /add money/i })
  ).toBeInTheDocument();
});
