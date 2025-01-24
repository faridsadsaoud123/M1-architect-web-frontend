import { useEffect, useRef } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const ConfirmationMessage = () => {
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div>
        Voulez-vous supprime le parcours ?
      </div>
      
    </div>
  )
}
