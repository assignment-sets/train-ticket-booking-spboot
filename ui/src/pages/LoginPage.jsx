import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();
  const formRef = useRef(null);
  const [values, setValues] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (event) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  }

  function validate() {
    const errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!values.password) {
      errors.password = "Please enter your password.";
    }
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await loginUser(values);
      navigate("/", { replace: true });
    } catch (error) {
      setFormError(error.message || "Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-display-md mb-6">Log in</h1>

      {formError && (
        <div
          role="alert"
          className="mb-5 rounded-sm border border-error/20 bg-error/5 px-4 py-3 text-body-sm text-error"
        >
          {formError}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-4">
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
          <div>
            <TextInput
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={update("password")}
              error={fieldErrors.password}
            />
            <div className="mt-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-body-sm text-ink underline-offset-2 hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>

        <Button type="submit" fullWidth disabled={submitting} className="mt-6">
          {submitting ? "Logging in…" : "Continue"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-caption-sm text-muted">or</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-body-sm text-ink">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-primary hover:text-primary-active"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
