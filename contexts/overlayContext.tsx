
import React, { createContext, useState, useContext } from "react";
import GlobalOverlay from "../components/ui/globalOverlay";

interface OverlayContextType {
  showOverlay: (content: React.ReactNode) => void;
  hideOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | null>(null);

export const OverlayProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const showOverlay = (c: React.ReactNode) => {
    setContent(c);
    setVisible(true);
  };

  const hideOverlay = () => setVisible(false);

  return (
    <OverlayContext.Provider value={{ showOverlay, hideOverlay }}>
      {children}
      <GlobalOverlay visible={visible}>{content}</GlobalOverlay>
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => useContext(OverlayContext)!;
