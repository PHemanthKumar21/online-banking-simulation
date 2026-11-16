# NovaBank – React Online Banking Simulation

A fully functional **Vite + React + React Router + Bootstrap 5** recreation of the original NovaBank frontend banking simulation.

## Features

- **Demo login / logout** – any username creates its own isolated data
- **Dashboard / Overview** – balance, credits, debits, account details, recent transactions
- **Money transfer** – validation, confirmation modal, live balance update + debit transaction
- **Transaction history** – search, type & date filters, CSV export
- **Profile** – view / edit personal details, masked account number
- **Help** – FAQs + reset demo data
- Persistent per-username data via `localStorage` (same business logic as the original)

## Tech stack

- Vite 6
- React 19
- React Router 7
- Bootstrap 5 + Bootstrap Icons
- Pure CSS (premium gradient theme)

## Quick start

```bash
cd novabank-react
npm install
npm run dev
```

Open the URL shown (usually http://localhost:5173).

### Demo login

- Username: `demo_user`
- Password: anything (e.g. `Demo@123`)

Or use the “Fill demo credentials” button on the login page.

## Project structure

```
novabank-react/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── context/
    │   └── BankContext.jsx
    ├── utils/
    │   └── bankStore.js
    ├── components/
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx
    │   └── Toast.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Dashboard.jsx
    │   ├── Transfer.jsx
    │   ├── Transactions.jsx
    │   ├── Profile.jsx
    │   └── Help.jsx
    └── styles/
        └── index.css
```

## How data works

- All demo data is stored in the browser under `novabank_users_v2`.
- Session username is stored in `novabank_session`.
- Transfer deducts balance and prepends a debit transaction.
- Each username has its own balance, transactions and profile.

**This is a frontend simulation only. Never enter real banking credentials.**
