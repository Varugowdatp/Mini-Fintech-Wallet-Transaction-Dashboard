import React from "react";
import { render, screen } from "@testing-library/react";
import TransactionCard from "../../components/TransactionCard";

test("renders transaction amount", () => {
  render(
    <TransactionCard
      transaction={{
        id: "1",
        type: "credit",
        amount: 100,
        description: "Test",
        status: "success",
        createdAt: new Date().toISOString(),
      }}
    />
  );

  expect(screen.getByText(/\$100.00/)).toBeInTheDocument();
});
