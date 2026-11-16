/**
 * NovaBank demo storage – pure JS helpers (same business logic as original).
 * Data lives in localStorage, keyed per username.
 */

const USERS_KEY = "novabank_users_v2";
const SESSION_KEY = "novabank_session";
const LEGACY_KEY = "novabank_demo_v1";

const legacySeed = () => ({
  user: {
    name: "Demo User",
    username: "demo_user",
    password: "Demo@123",
    accountNumber: "123456789012",
    ifsc: "DEMO0001234",
    accountType: "Savings (Demo)",
    branch: "NovaBank Demo Branch",
    email: "demo@example.com",
    phone: "0000000000",
    city: "Sample City",
    profileCompleted: true,
  },
  balance: 25000,
  transactions: [
    {
      id: "TXN1001",
      type: "credit",
      name: "Salary credit",
      amount: 15000,
      date: "2026-11-10",
      status: "Success",
      note: "Monthly salary",
    },
    {
      id: "TXN1002",
      type: "debit",
      name: "Online shopping",
      amount: 2000,
      date: "2026-11-11",
      status: "Success",
      note: "Shopping",
    },
  ],
});

const normalize = (name) => String(name || "demo_user").trim().toLowerCase();

function accountNumberFor(username) {
  let hash = 0;
  for (const ch of username) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return "40" + String(hash).padStart(10, "0").slice(-10);
}

function makeUser(username) {
  const pretty = username
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    user: {
      name: pretty || "Demo User",
      username,
      accountNumber:
        username === "demo_user" ? "123456789012" : accountNumberFor(username),
      ifsc: "NOVB0001234",
      accountType: "Savings",
      branch: "NovaBank Demo Branch",
      email: "",
      phone: "",
      city: "",
      profileCompleted: false,
    },
    balance: 25000,
    transactions: [],
  };
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function migrate() {
  const users = readUsers();
  if (Object.keys(users).length) return users;
  let old = null;
  try {
    old = JSON.parse(localStorage.getItem(LEGACY_KEY) || "null");
  } catch {}
  if (old && old.user) {
    const username = normalize(old.user.username || "demo_user");
    old.user.username = username;
    old.user.profileCompleted = Boolean(
      old.user.email || old.user.phone || old.user.city
    );
    users[username] = old;
  } else {
    users.demo_user = legacySeed();
  }
  writeUsers(users);
  return users;
}

function currentUsername() {
  const s = localStorage.getItem(SESSION_KEY);
  return normalize(s && s !== "active" ? s : "demo_user");
}

export const BankStore = {
  get() {
    const users = migrate();
    const username = currentUsername();
    if (!users[username]) {
      users[username] = makeUser(username);
      writeUsers(users);
    }
    return users[username];
  },

  save(data) {
    const users = migrate();
    users[currentUsername()] = data;
    writeUsers(users);
    return data;
  },

  login(username) {
    const key = normalize(username);
    const users = migrate();
    if (!users[key]) users[key] = makeUser(key);
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, key);
    return users[key];
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  isLoggedIn() {
    return Boolean(localStorage.getItem(SESSION_KEY));
  },

  getSessionUser() {
    return localStorage.getItem(SESSION_KEY);
  },

  reset() {
    const users = migrate();
    const u = currentUsername();
    users[u] = u === "demo_user" ? legacySeed() : makeUser(u);
    writeUsers(users);
    return users[u];
  },

  money(n) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(n) || 0);
  },

  shortMoney(n) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);
  },

  maskAccount(a) {
    return "•••• •••• " + String(a || "").slice(-4);
  },

  today() {
    return new Date().toISOString().slice(0, 10);
  },

  addTransaction(tx) {
    const d = this.get();
    d.transactions.unshift(tx);
    this.save(d);
    return d;
  },

  transfer({ toAccount, amount, note, beneficiary }) {
    const d = this.get();
    const amt = Number(amount);
    if (amt <= 0 || amt > d.balance) {
      throw new Error(
        amt > d.balance
          ? "Insufficient balance for this transfer."
          : "Enter a valid amount greater than zero."
      );
    }
    d.balance = Math.round((d.balance - amt) * 100) / 100;
    const id =
      "TXN" +
      Date.now().toString().slice(-8) +
      Math.floor(Math.random() * 90 + 10);
    const tx = {
      id,
      type: "debit",
      name: beneficiary || "Transfer to " + (toAccount || "account"),
      amount: amt,
      date: this.today(),
      status: "Success",
      note: note || "Fund transfer",
      toAccount: toAccount || "",
    };
    d.transactions.unshift(tx);
    this.save(d);
    return { data: d, transaction: tx };
  },
};
