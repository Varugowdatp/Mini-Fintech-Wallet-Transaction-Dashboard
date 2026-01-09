import React from "react";
import { render, screen } from "@testing-library/react";
import TransactionFilters from "../../components/TransactionFilters";

test("renders status filter", () => {
  render(
    <TransactionFilters
      statusFilter="all"
      onStatusChange={() => {}}
      startDate=""
      endDate=""
      onStartDateChange={() => {}}
      onEndDateChange={() => {}}
      onClear={() => {}}
    />
  );

  expect(screen.getByText("Status")).toBeInTheDocument();
});
