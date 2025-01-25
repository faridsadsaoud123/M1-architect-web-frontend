import { ReactNode } from "react";

export const ModalBody: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div className="mb-4">{children}</div>
  );