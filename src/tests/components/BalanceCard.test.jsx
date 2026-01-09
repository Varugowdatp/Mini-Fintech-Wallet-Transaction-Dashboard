import React from "react";
import { render, screen } from "@testing-library/react";
import BalanceCard from "../../components/BalanceCard";

test("renders balance", () => {
  render(<BalanceCard balance={100} isLoading={false} />);

   
  expect(screen.getByText(/\$100\.00/)).toBeInTheDocument();
});
