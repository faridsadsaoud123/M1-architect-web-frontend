import React, { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const modalFooterVariants = cva("flex", {
  variants: {
    justify: {
      between: "justify-between",
      center: "justify-center",
      end: "justify-end",
      start: "justify-start",
    },
    padding: {
      none: "p-0",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    },
    border: {
      none: "",
      top: "border-t border-gray-300",
    },
  },
  defaultVariants: {
    justify: "between",
    padding: "md",
    border: "top",
  },
});

type ModalFooterProps = {
  children: ReactNode;
} & VariantProps<typeof modalFooterVariants>;

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  justify,
  padding,
  border,
}) => {
  return (
    <div className={modalFooterVariants({ justify, padding, border })}>
      {children}
    </div>
  );
};
