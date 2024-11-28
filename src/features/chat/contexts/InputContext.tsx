import React, {createContext, useRef, useContext, ReactNode} from 'react';

interface InputContextType {
  inputRef: React.RefObject<TextInput>;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

interface InputProviderProps {
  children: ReactNode;
}

export const InputProvider: React.FC<InputProviderProps> = ({children}) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <InputContext.Provider value={{inputRef}}>{children}</InputContext.Provider>
  );
};

export const useInput = (): React.RefObject<TextInput> => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('useInput must be used within an InputProvider');
  }
  return context.inputRef;
};
