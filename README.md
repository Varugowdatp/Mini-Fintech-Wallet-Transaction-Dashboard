

# Mini Wallet Hub

A React-based wallet management application that demonstrates transaction lifecycle handling, balance management, filtering, error handling, and testing using a mock API.

---

## Features

### Wallet
- View current wallet balance
- Add money to wallet
- Transfer money to other users
- Automatic 2% transaction fee on transfers

### Transactions
- Supports transaction states:
  - `pending`
  - `success`
  - `failed`
- Balance updates only when a transaction is successful
- Failed transactions do not affect balance
- View recent transactions
- View complete transaction history
- Delete completed transactions

### Filters
- Filter transactions by status (all / pending / success / failed)
- Filter transactions by date range

---

##  UX & Error Handling

- Toast notifications for user feedback
- Inline form validation
- Loading skeletons during data fetch
- Global error handling using a React Error Boundary

---

##  Tech Stack

- React (Vite)
- Tailwind CSS
- Browser LocalStorage (mock backend)
- Vitest + React Testing Library

---

##  API Design (Mock)

The application follows REST-style behavior using a simulated API.

| Action | Method |
|------|--------|
| Fetch balance | GET |
| Fetch transactions | GET |
| Create transaction | POST |
| Update transaction status | PATCH |
| Delete transaction | DELETE |

Transactions are created in a **pending** state and later updated to **success** or **failed**, simulating real-world payment processing.

---
##  Architectural Notes

The application follows a component-based architecture with clear separation of concerns.

- **UI Components**  
  All reusable UI elements such as Header, BalanceCard, TransactionCard, Modals, and Filters are placed inside the `components` directory.  
  These components are stateless where possible and receive data via props.

- **Page-Level State Management**  
  The main application state (balance, transactions, filters, loading states) is managed in `Index.jsx`.  
  This keeps business logic centralized and avoids unnecessary prop drilling.

- **Service Layer (API Abstraction)**  
  All data-related operations are abstracted into `services/api.js`.  
  This simulates REST-style API behavior (GET, POST, PATCH, DELETE) and allows easy replacement with a real backend in the future.

- **Transaction Lifecycle Design**  
  Transactions are created in a `pending` state and later updated to `success` or `failed`.  
  Balance updates are triggered only when a transaction succeeds, ensuring correct financial logic.

- **Global Error Handling**  
  A React Error Boundary wraps the application to catch unexpected runtime errors and display a fallback UI instead of crashing the app.

- **Testing Architecture**  
  Tests are organized into component tests, service-level tests, and integration tests to ensure correctness at multiple levels.

This architecture improves maintainability, testability, and scalability while keeping the application simple and aligned with assignment scope.



## 🧪 Testing

Tests are implemented using **Vitest** and **@testing-library/react**.

### Coverage
- Unit tests for UI components
- Service-level API tests
- Integration test for wallet flow
- Error Boundary fallback test

### Run tests
```bash
npm test
````

---

##  Project Structure (Key Files)

```
src/
 ├── components/
 │   ├── Header.jsx
 │   ├── BalanceCard.jsx
 │   ├── TransactionCard.jsx
 │   ├── AddMoneyModal.jsx
 │   ├── TransferModal.jsx
 │   ├── TransactionFilters.jsx
 │   ├── Toast.jsx
 │   └── ErrorBoundary.jsx
 ├── pages/
 │   └── Index.jsx
 ├── services/
 │   └── api.js
 ├── tests/
 │   ├── components/
 │   ├── integration/
 │   └── services/
```

---

##  Assumptions

* The assignment allows a mock backend; therefore LocalStorage is used instead of a real server.
* Network latency and asynchronous behavior are simulated using artificial delays.
* Transaction fee is fixed at 2% for demonstration purposes.
* Balance is updated only when a transaction succeeds.
* Failed transactions are stored for audit/history but do not affect balance.
* Each browser maintains independent LocalStorage.
* User authentication and authorization are out of scope.
* Currency is assumed to be a single configurable currency defined in application configuration.

---
##  Limitations

- Uses LocalStorage, so data is browser-specific and non-persistent.
- No real payment gateway or backend server integration.
- No authentication or authorization mechanism.
- Concurrent transactions are not handled.
- Application state resets when browser storage is cleared.


##  Setup & Run

```bash
npm install
npm run dev
```



 

 

