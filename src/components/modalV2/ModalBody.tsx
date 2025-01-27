import React, { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const modalBodyVariants = cva("mb-4", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    },
    scroll: {
      true: "overflow-y-auto max-h-96", // Scrolling si contenu trop grand
      false: "",
    },
    border: {
      none: "",
      top: "border-t border-gray-300",
      bottom: "border-b border-gray-300",
    },
  },
  defaultVariants: {
    padding: "md",
    scroll: false,
    border: "none",
  },
});

type ModalBodyProps = {
  children: ReactNode;
} & VariantProps<typeof modalBodyVariants>;

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  padding,
  scroll,
  border,
}) => {
  return (
    <div className={modalBodyVariants({ padding, scroll, border })}>
      {children}
    </div>
  );
};
