import { createContext, useReducer, useContext, ReactNode } from "react";
import { appStateReducer } from "./reducer";
import { emptyReplacement, emptyStep, sampleReplacement } from "./utils/data";
import type { SerialReplacement, AppAction } from "./types";

type AppContextType = {
  state: SerialReplacement;
  dispatch: React.Dispatch<AppAction>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, sampleReplacement, data => ({
    ...data,
    steps: data.steps.length > 0 ? data.steps : [emptyStep],
  }));

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
