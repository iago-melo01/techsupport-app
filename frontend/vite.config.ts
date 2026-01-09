import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		proxy: {
			"/api": {
				target: "http://localhost:8000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		tailwind(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@Layouts": path.resolve(__dirname, "./src/Layouts"),
			"@Modules": path.resolve(__dirname, "./src/Modules"),
			"@Components": path.resolve(__dirname, "./src/Components"),
			"@Hooks": path.resolve(__dirname, "./src/Hooks"),
			"@Lib": path.resolve(__dirname, "./src/Lib"),
			"@Ui": path.resolve(__dirname, "./src/Ui"),
		},
	},
});
