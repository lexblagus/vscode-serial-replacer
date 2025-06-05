import { createContext, useReducer, useContext, ReactNode } from "react";
import { appStateReducer } from "./reducer";
import initialState from "./utils/initial-state";
import type { SerialReplacerData, AppAction } from "./types";

type AppContextType = {
  state: SerialReplacerData;
  dispatch: React.Dispatch<AppAction>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
