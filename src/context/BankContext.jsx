import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { BankStore } from "../utils/bankStore";

const BankContext = createContext(null);

export function BankProvider({ children }) {
  const [data, setData] = useState(null);
  const [session, setSession] = useState(() => BankStore.getSessionUser());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (BankStore.isLoggedIn()) {
      setData(BankStore.get());
      setSession(BankStore.getSessionUser());
    } else {
      setData(null);
      setSession(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback((username) => {
    BankStore.login(username);
    refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    BankStore.logout();
    setData(null);
    setSession(null);
  }, []);

  const save = useCallback((next) => {
    BankStore.save(next);
    setData({ ...next });
  }, []);

  const reset = useCallback(() => {
    const next = BankStore.reset();
    setData({ ...next });
  }, []);

  const transfer = useCallback((payload) => {
    const result = BankStore.transfer(payload);
    setData({ ...result.data });
    return result;
  }, []);

  const updateProfile = useCallback((fields) => {
    const current = BankStore.get();
    current.user = { ...current.user, ...fields, profileCompleted: true };
    BankStore.save(current);
    setData({ ...current });
  }, []);

  const value = {
    data,
    session,
    loading,
    isLoggedIn: Boolean(session),
    login,
    logout,
    save,
    reset,
    transfer,
    updateProfile,
    refresh,
    money: BankStore.money,
    shortMoney: BankStore.shortMoney,
    maskAccount: BankStore.maskAccount,
  };

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used within BankProvider");
  return ctx;
}
