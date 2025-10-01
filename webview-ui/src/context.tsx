import { createContext, useReducer, useContext, ReactNode, useEffect, Dispatch } from "react";
import { appStateReducer } from "./reducer";
import { useRetrievePersistedData } from "./hooks/useRetrievePersistedData";
import { useBackendMessages } from "./hooks/useBackendMessages";
import { useSubscribeChanges } from "./hooks/useSubscribeChanges";
import { useSetReplacementParameters } from "./hooks/useSetReplacementParameters";
import { usePersistFieldHistory } from "./hooks/usePersistFieldHistory";
import { emptyStep, emptyWebviewState } from "../../shared/data";

import type { WebviewState } from "../../shared/replacements";
import type { AppAction } from "./types/actions";

type AppContextType = {
  state: WebviewState;
  dispatch: Dispatch<AppAction>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  console.log('■ AppProvider');

  const [state, dispatch] = useReducer(appStateReducer, emptyWebviewState(), (data) => ({
    ...data,
    loaded: {
      ...data.loaded,
      // create first empty step
      steps: data.loaded.steps.length > 0 ? data.loaded.steps : [emptyStep()],
    },
  }));

  useRetrievePersistedData();
  useBackendMessages(dispatch, state);
  useSubscribeChanges(state.loaded.useCurrentEditors);
  useSetReplacementParameters(state.loaded);
  usePersistFieldHistory(state.fieldHistory);

  // Debug state
  useEffect(() => {
    console.log("state", JSON.stringify(state));
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
