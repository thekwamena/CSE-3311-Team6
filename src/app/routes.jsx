import { Navigate, Outlet, createBrowserRouter } from "react-router";
import AuthScreen from "./screens/AuthScreen";
import BrowseScreen from "./screens/BrowseScreen";
import ItemDetailsScreen from "./screens/ItemDetailsScreen";
import ChatScreen from "./screens/ChatScreen";
import SuccessScreen from "./screens/SuccessScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SearchScreen from "./screens/SearchScreen";
import MessagesScreen from "./screens/MessagesScreen";
import CreateListingScreen from "./screens/CreateListingScreen";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

function GuestOnlyRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/browse" replace /> : <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <GuestOnlyRoute />,
    children: [
      {
        path: "/",
        Component: AuthScreen,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/browse",
        Component: BrowseScreen,
      },
      {
        path: "/item/:id",
        Component: ItemDetailsScreen,
      },
      {
        path: "/chat/:id",
        Component: ChatScreen,
      },
      {
        path: "/success",
        Component: SuccessScreen,
      },
      {
        path: "/profile",
        Component: ProfileScreen,
      },
      {
        path: "/settings",
        Component: SettingsScreen,
      },
      {
        path: "/search",
        Component: SearchScreen,
      },
      {
        path: "/messages",
        Component: MessagesScreen,
      },
      {
        path: "/create-listing",
        Component: CreateListingScreen,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

