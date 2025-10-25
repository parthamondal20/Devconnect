import { toast } from "react-toastify";
export const showSuccess = (msg) =>
  toast.success(msg, {
    style: {
      background: "#e6fffa",
      color: "#059669",
      border: "1px solid #059669",
      fontWeight: "500",
    },
    progressStyle: {
      background: "#059669",
    },
  });
export const showError = (msg) =>
  toast.error(msg, {
    style: {
      background: "#fee2e2",
      color: "#b91c1c",
      border: "1px solid #b91c1c",
      fontWeight: "500",
    },
    progressStyle: {
      background: "#b91c1c",
    },
  });
