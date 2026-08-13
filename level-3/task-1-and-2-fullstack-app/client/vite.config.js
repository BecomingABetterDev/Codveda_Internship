import react from "@vitejs/plugin-react";

export default {
    plugins: [react()],
    optimizeDeps: {
        include: ["react-router-dom", "axios", "react-hot-toast", "lucide-react"],
    },
    server: {
        port: 3000,
    },
};