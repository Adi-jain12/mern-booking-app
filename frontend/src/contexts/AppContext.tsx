import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

//describes different things exposing to the components
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode; //giving the type to children with inline type instead of defining another type
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  //calls api endpoint i.e apiClient.validateToken and returns if there is error and set that error as isError(useQuery handles it by default) or not
  //if it returns no error no extra work and token is validated
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },

        isLoggedIn: !isError,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  //defining as hook so that other components can use this context and can get things easily
  const context = useContext(AppContext);
  return context as AppContext;
};
