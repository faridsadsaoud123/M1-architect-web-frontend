// components/modalV2/ModalFooter.tsx

import { ReactNode } from "react";

export const ModalFooter: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  return <div className="flex justify-end gap-2 mt-4">{children}</div>;
};
