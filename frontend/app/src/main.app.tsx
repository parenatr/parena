import App from "./App";
import "./index.css";
/**
 * main.app.tsx
 * Gerçek React entry component'ini export eder
 * Fast Refresh kuralı burada aktif kalır
 */
export default function AppEntrypoint() {
  return <App />;
}