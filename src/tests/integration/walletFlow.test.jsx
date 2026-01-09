import { createTransaction, getBalance } from "../../services/api";

test("add money updates balance", async () => {
  localStorage.clear();
  localStorage.setItem("wallet_transactions", JSON.stringify([]));
  localStorage.setItem("wallet_balance", "0");

  await createTransaction({
    type: "credit",
    amount: 200,
    status: "success",
  });

  const balance = await getBalance();
  expect(balance).toBe(200);
});
