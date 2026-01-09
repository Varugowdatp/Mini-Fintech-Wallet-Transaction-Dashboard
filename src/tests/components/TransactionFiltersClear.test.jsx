import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionFilters from "../../components/TransactionFilters";

test("calls onClear when Clear Filters button is clicked", () => {
  const onClearMock = vi.fn();

  render(
    <TransactionFilters
      statusFilter="all"
      onStatusChange={() => {}}
      startDate=""
      endDate=""
      onStartDateChange={() => {}}
      onEndDateChange={() => {}}
      onClear={onClearMock}
    />
  );

  const clearButton = screen.getByRole("button", {
    name: /clear filters/i,
  });

  fireEvent.click(clearButton);

  expect(onClearMock).toHaveBeenCalledTimes(1);
});
