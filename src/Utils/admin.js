const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

const isAdmin = (email) => {
    if (!email) return false
    return ADMIN_EMAILS.includes(email.toLowerCase())
}

export default isAdmin