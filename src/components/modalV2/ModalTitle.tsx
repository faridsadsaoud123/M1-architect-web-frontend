// components/modalV2/ModalTitle.tsx

import { ReactNode } from "react";

export const ModalTitle: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  return <h2 className="text-xl font-bold mb-2">{children}</h2>;
};
