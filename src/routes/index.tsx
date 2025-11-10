import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "pages/layout/Public";
import LoginPage from "pages/auth/login";
import SignupPage from "pages/auth/signup";
import VerifyOTPPage from "pages/auth/verify-otp";
import DashboardLayout from "pages/dashboard/layout";
import DashboardPage from "pages/dashboard";
import ShareEmotionPage from "pages/dashboard/share-emotion";
import ChatPage from "pages/dashboard/chat";
import JournalPage from "pages/dashboard/journal";
import AnalyticsPage from "pages/dashboard/analytics";
import ResourcesPage from "pages/dashboard/resources";
import { ROUTE_URL } from "@/constants/routes";

const routes = [
    {
        path: ROUTE_URL.HOME,
        element: <PublicLayout />,
        children: [
            {
                path: ROUTE_URL.HOME,
                element: <Navigate to={ROUTE_URL.LOGIN} replace />,
            },
            {
                path: ROUTE_URL.LOGIN,
                element: <LoginPage />,
            },
            {
                path: ROUTE_URL.SIGNUP,
                element: <SignupPage />,
            },
            {
                path: ROUTE_URL.VERIFY_OTP,
                element: <VerifyOTPPage />,
            },
        ],
    },
    {
        path: ROUTE_URL.DASHBOARD,
        element: <DashboardLayout />,
        children: [
            {
                path: ROUTE_URL.DASHBOARD,
                element: <DashboardPage />,
            },
            {
                path: ROUTE_URL.SHARE_EMOTION,
                element: <ShareEmotionPage />,
            },
            {
                path: ROUTE_URL.CHAT,
                element: <ChatPage />,
            },
            {
                path: `${ROUTE_URL.CHAT}/:sessionId`,
                element: <ChatPage />,
            },
            {
                path: ROUTE_URL.JOURNAL,
                element: <JournalPage />,
            },
            {
                path: ROUTE_URL.ANALYTICS,
                element: <AnalyticsPage />,
            },
            {
                path: ROUTE_URL.RESOURCES,
                element: <ResourcesPage />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to={ROUTE_URL.HOME} replace />,
    },
];

export const router = createBrowserRouter(routes);

