const API_BASE = "https://jsonplaceholder.typicode.com";

const STORAGE_KEYS = {
  TRANSACTIONS: "wallet_transactions",
  BALANCE: "wallet_balance",
};

 
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    const mockTransactions = [
      {
        id: "mock-success-1",
        type: "credit",
        amount: 5000,
        description: "Initial deposit",
        status: "success",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "mock-success-2",
        type: "debit",
        amount: 500,
        description: "Transfer to John Doe",
        status: "success",
        recipient: "John Doe",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: "mock-pending-1",
        type: "credit",
        amount: 1200,
        description: "Adding money",
        status: "pending",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "mock-failed-1",
        type: "debit",
        amount: 3000,
        description: "Transfer to Jane Smith",
        status: "failed",
        recipient: "Jane Smith",
        failureReason: "Insufficient balance",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(mockTransactions)
    );
    localStorage.setItem(STORAGE_KEYS.BALANCE, "6490");
  }
};

initializeMockData();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

 
export const getUsers = async () => {
  await delay(500);
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");

  const data = await response.json();
  return data.slice(0, 10).map((user) => ({
    id: String(user.id),
    name: user.name,
    email: user.email,
  }));
};

 
export const getTransactions = async () => {
  await delay(500);
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions = data ? JSON.parse(data) : [];

  return transactions
    .filter((t) => !t.deleted)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

 
export const getBalance = async () => {
  await delay(300);

  let balance = localStorage.getItem(STORAGE_KEYS.BALANCE);
  if (balance === null) {
    localStorage.setItem(STORAGE_KEYS.BALANCE, "0");
    balance = "0";
  }

  return parseFloat(balance);
};
 
export const createTransaction = async (transaction) => {
  await delay(800);

  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions = data ? JSON.parse(data) : [];

  const newTransaction = {
    ...transaction,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };

  transactions.push(newTransaction);
  localStorage.setItem(
    STORAGE_KEYS.TRANSACTIONS,
    JSON.stringify(transactions)
  );

 
  if (transaction.status === "success") {
    const currentBalance = parseFloat(
      localStorage.getItem(STORAGE_KEYS.BALANCE) || "0"
    );

    let newBalance = currentBalance;

    if (transaction.type === "credit") {
      newBalance += transaction.amount;
    } else if (transaction.type === "debit" || transaction.type === "fee") {
      newBalance -= transaction.amount;
    }

    localStorage.setItem(STORAGE_KEYS.BALANCE, String(newBalance));
  }

  return newTransaction;
};

 
export const updateTransactionStatus = async (
  id,
  status,
  failureReason
) => {
  await delay(500);

  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions = data ? JSON.parse(data) : [];

  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Transaction not found");

  const transaction = transactions[index];

  if (transaction.status === "success") return transaction;

  transaction.status = status;
  if (failureReason) {
    transaction.failureReason = failureReason;
  }

  if (status === "success") {
    const currentBalance = parseFloat(
      localStorage.getItem(STORAGE_KEYS.BALANCE) || "0"
    );

    let newBalance = currentBalance;

    if (transaction.type === "credit") {
      newBalance += transaction.amount;
    } else if (transaction.type === "debit" || transaction.type === "fee") {
      newBalance -= transaction.amount;
    }

    localStorage.setItem(STORAGE_KEYS.BALANCE, String(newBalance));
  }

  localStorage.setItem(
    STORAGE_KEYS.TRANSACTIONS,
    JSON.stringify(transactions)
  );

  return transaction;
};
 
export const deleteTransaction = async (id) => {
  await delay(500);

  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions = data ? JSON.parse(data) : [];

  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Transaction not found");

  transactions[index].deleted = true;
  localStorage.setItem(
    STORAGE_KEYS.TRANSACTIONS,
    JSON.stringify(transactions)
  );
};
