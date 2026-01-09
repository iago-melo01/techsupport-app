import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import { lazy } from "react";

const AuthenticatedLayout = lazy(
	() => import("@Layouts/User/AuthenticatedLayout")
);
const GuestLayout = lazy(() => import("@Layouts/User/GuestLayout"));

// Auth
const LoginPage = lazy(() => import("@Modules/Auth/Pages/LoginPage"));

// Profile
const ProfilePage = lazy(() => import("@Modules/User/Pages/ProfilePage"));

// Dashboard
const DashboardPage = lazy(() => import("@Modules/Dashboard/Pages/DashboardPage"));

export const router = createBrowserRouter([
	{
		path: "/",
		element: <GuestLayout />,
		children: [
			{
				index: true,
				element: <Navigate to="/login" replace />,
			},
			{
				path: "login",
				element: <LoginPage />,
			},
		],
	},
	{
		path: "/",
		element: (
			<RequireAuth>
				<AuthenticatedLayout />
			</RequireAuth>
		),
		children: [
			{
				index: true,
				element: <Navigate to="/dashboard" replace />,
			},
			{
				path: "dashboard",
				element: <DashboardPage />,
			},
			{
				path: "perfil",
				element: <ProfilePage />,
			},
		],
	},
]);
