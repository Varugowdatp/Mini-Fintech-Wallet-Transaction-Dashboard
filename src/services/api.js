const API_BASE = "https://jsonplaceholder.typicode.com";

const STORAGE_KEYS = {
  TRANSACTIONS: "wallet_transactions",
  BALANCE: "wallet_balance",
};

 
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    const now = Date.now();

    const mockTransactions = [
      {
        id: "tx-1",
        type: "credit",
        amount: 8000,
        description: "Initial deposit",
        status: "success",
        createdAt: new Date(now - 86400000 * 10).toISOString(),
      },
      {
        id: "tx-2",
        type: "debit",
        amount: 1200,
        description: "Transfer to Leanne Graham",
        status: "success",
        recipient: "Leanne Graham",
        createdAt: new Date(now - 86400000 * 9).toISOString(),
      },
      {
        id: "tx-3",
        type: "fee",
        amount: 24,
        description: "Transfer fee",
        status: "success",
        createdAt: new Date(now - 86400000 * 9).toISOString(),
      },
      {
        id: "tx-4",
        type: "debit",
        amount: 2000,
        description: "Transfer to Ervin Howell",
        status: "success",
        recipient: "Ervin Howell",
        createdAt: new Date(now - 86400000 * 8).toISOString(),
      },
      {
        id: "tx-5",
        type: "fee",
        amount: 40,
        description: "Transfer fee",
        status: "success",
        createdAt: new Date(now - 86400000 * 8).toISOString(),
      },
      {
        id: "tx-6",
        type: "credit",
        amount: 1500,
        description: "Adding money",
        status: "pending",
        createdAt: new Date(now - 86400000 * 7).toISOString(),
      },
      {
        id: "tx-7",
        type: "debit",
        amount: 3000,
        description: "Transfer to Clementine Bauch",
        status: "failed",
        recipient: "Clementine Bauch",
        failureReason: "Insufficient balance",
        createdAt: new Date(now - 86400000 * 6).toISOString(),
      },
      {
        id: "tx-8",
        type: "credit",
        amount: 2500,
        description: "Adding money",
        status: "success",
        createdAt: new Date(now - 86400000 * 5).toISOString(),
      },
      {
        id: "tx-9",
        type: "debit",
        amount: 1000,
        description: "Transfer to Patricia Lebsack",
        status: "success",
        recipient: "Patricia Lebsack",
        createdAt: new Date(now - 86400000 * 4).toISOString(),
      },
      {
        id: "tx-10",
        type: "fee",
        amount: 20,
        description: "Transfer fee",
        status: "success",
        createdAt: new Date(now - 86400000 * 4).toISOString(),
      },
      {
        id: "tx-11",
        type: "debit",
        amount: 700,
        description: "Transfer to Chelsey Dietrich",
        status: "success",
        recipient: "Chelsey Dietrich",
        createdAt: new Date(now - 86400000 * 3).toISOString(),
      },
      {
        id: "tx-12",
        type: "fee",
        amount: 14,
        description: "Transfer fee",
        status: "success",
        createdAt: new Date(now - 86400000 * 3).toISOString(),
      },
      {
        id: "tx-13",
        type: "debit",
        amount: 1800,
        description: "Transfer to Mrs. Dennis Schulist",
        status: "success",
        recipient: "Mrs. Dennis Schulist",
        createdAt: new Date(now - 86400000 * 2).toISOString(),
      },
      {
        id: "tx-14",
        type: "fee",
        amount: 36,
        description: "Transfer fee",
        status: "success",
        createdAt: new Date(now - 86400000 * 2).toISOString(),
      },
      {
        id: "tx-15",
        type: "credit",
        amount: 1000,
        description: "Adding money",
        status: "pending",
        createdAt: new Date(now - 86400000).toISOString(),
      },
    ];

    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(mockTransactions)
    );

     
    localStorage.setItem(STORAGE_KEYS.BALANCE, "4666");
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
