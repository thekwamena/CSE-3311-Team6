import { createBrowserRouter } from "react-router";
import AuthScreen from "./screens/AuthScreen";
import BrowseScreen from "./screens/BrowseScreen";
import ItemDetailsScreen from "./screens/ItemDetailsScreen";
import ChatScreen from "./screens/ChatScreen";
import SuccessScreen from "./screens/SuccessScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SearchScreen from "./screens/SearchScreen";
import MessagesScreen from "./screens/MessagesScreen";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: AuthScreen,
    },
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
      path: "*",
      Component: AuthScreen,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);