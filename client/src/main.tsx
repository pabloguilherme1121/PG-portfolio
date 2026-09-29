import "./index.css";

if (import.meta.env.VITE_STATIC_DEPLOY === "true") {
  void import("./bootstrapStatic");
} else {
  void import("./bootstrapServer");
}
