import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const modalTitleVariants = cva("text-xl font-bold", {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    color: {
      default: "text-gray-800",
      primary: "text-blue-600",
      danger: "text-red-600",
    },
    size: {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
    },
  },
  defaultVariants: {
    align: "left",
    color: "default",
    size: "md",
  },
})

type ModalTitleProps = {
  title: string
} & VariantProps<typeof modalTitleVariants>

export const ModalTitle: React.FC<ModalTitleProps> = ({
  title,
  align,
  color,
  size,
}) => {
  return (
    <div className="mb-4">
      <h2 className={modalTitleVariants({ align, color, size })}>{title}</h2>
    </div>
  )
}
