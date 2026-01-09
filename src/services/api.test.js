import { createTransaction, getBalance } from "./api";

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("wallet_transactions", JSON.stringify([]));
  localStorage.setItem("wallet_balance", "0");
});

test("creates credit transaction and updates balance", async () => {
  await createTransaction({
    type: "credit",
    amount: 50,
    status: "success",
  });

  const balance = await getBalance();
  expect(balance).toBe(50);
});
