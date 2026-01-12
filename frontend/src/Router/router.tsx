import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import RootRedirect from "./RootRedirect";
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

// Users
const UsersPage = lazy(() => import("@Modules/User/Pages/UsersPage"));

export const router = createBrowserRouter([
	{
		path: "/",
		element: <RootRedirect />,
	},
	{
		path: "/",
		element: <GuestLayout />,
		children: [
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
				path: "dashboard",
				element: <DashboardPage />,
			},
			{
				path: "perfil",
				element: <ProfilePage />,
			},
			{
				path: "usuarios",
				element: <UsersPage />,
			},
		],
	},
]);
