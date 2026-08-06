import { useState, type InputHTMLAttributes, type ReactNode } from "react";

type FieldProps = {
  id: string;
  label: ReactNode;
  error?: string;
  children?: never;
} & InputHTMLAttributes<HTMLInputElement>;

/** Tasarımdaki `.field` bloğu: etiket + input + hata satırı. */
export function AuthField({ id, label, error, ...input }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={error ? true : undefined} {...input} />
      <p className={error ? "err on" : "err"} role="alert">
        {error}
      </p>
    </div>
  );
}

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M3 3l18 18" />
    <path d="M10.6 6.2A9.9 9.9 0 0112 6c6.4 0 10 7 10 7a17 17 0 01-3.2 4M6.6 6.6A17 17 0 002 13s3.6 7 10 7a9.7 9.7 0 004.4-1" />
    <path d="M9.9 9.9a3 3 0 004.2 4.2" />
  </svg>
);

/** Göster/gizle düğmeli parola alanı. */
export function AuthPasswordField({
  id,
  label,
  error,
  children,
  ...input
}: Omit<FieldProps, "children"> & { children?: ReactNode }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="inp-wrap has-toggle">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          {...input}
        />
        <button
          type="button"
          className="toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Parolayı gizle" : "Parolayı göster"}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {children}
      <p className={error ? "err on" : "err"} role="alert">
        {error}
      </p>
    </div>
  );
}
