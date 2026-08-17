import { useState } from "react"

const useToast = () => {
  const [show, setShow] = useState(false)
  const [type, setType] = useState("success")
  const [title, setTitle] = useState("Success")
  const [message, setMessage] = useState("")

  const showSuccess = (msg) => {
    setType("success")
    setTitle("Success")
    setMessage(msg)
    setShow(true)
  }

  const showError = (msg) => {
    setType("error")
    setTitle("Error")
    setMessage(msg)
    setShow(true)
  }

  const hide = () => setShow(false)

  return { show, setShow, type, title, message, showSuccess, showError, hide }
}

export default useToast