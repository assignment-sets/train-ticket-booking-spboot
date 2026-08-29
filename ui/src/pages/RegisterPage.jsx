import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import Button from "../components/Button"
import TextInput from "../components/TextInput"
import { useAuth } from "../context/useAuth"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [values, setValues] = useState({ name: "", email: "", password: "" })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (event) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  }

  function validate() {
    const errors = {}
    if (!values.name.trim()) {
      errors.name = "Please enter your full name."
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Please enter a valid email address."
    }
    if (values.password.length < 6) {
      errors.password = "Your password must be at least 6 characters."
    }
    return errors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError("")

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSubmitting(true)
    try {
      await registerUser(values)
      navigate("/", { replace: true })
    } catch (error) {
      setFormError(error.message || "Unable to create your account. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-display-md mb-6">Sign up</h1>

      {formError && (
        <div
          role="alert"
          className="mb-5 rounded-sm border border-error/20 bg-error/5 px-4 py-3 text-body-sm text-error"
        >
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-4">
          <TextInput
            label="Full name"
            autoComplete="name"
            placeholder="Alex Morgan"
            value={values.name}
            onChange={update("name")}
            error={fieldErrors.name}
          />
          <TextInput
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={update("email")}
            error={fieldErrors.email}
          />
          <TextInput
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={values.password}
            onChange={update("password")}
            error={fieldErrors.password}
            hint={fieldErrors.password ? undefined : "Use at least 6 characters."}
          />
        </div>

        <Button type="submit" fullWidth disabled={submitting} className="mt-6">
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-body-sm text-ink">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:text-primary-active">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}