// components/modalV2/ModalFooter.tsx

import { ReactNode } from "react";

export const ModalFooter: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex justify-end">{children}</div>
);