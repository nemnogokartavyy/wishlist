import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./normalize.css";
import "./index.css";

import Root from "./pages/Root";
import ErrorPage404 from "./pages/ErrorPage404";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Wishlist from "./pages/Wishlist";
import Friends from "./pages/Friends";
import FriendWishlist from "./pages/FriendWishlist";
// import Spinner from "./pages/components/Spinner";
// import BirthdayReminders from "./pages/components/BirthdayReminders";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import FriendAccept from "./pages/components/FriendAccept";
import HeroBlock from "./pages/HeroBlock";


const PrivateRoute = () => {
  const isAuth = localStorage.getItem("token");
  const location = useLocation();
  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const PublicRoute = () => {
  const isAuth = localStorage.getItem("token");
  return isAuth ? <Navigate to="/" replace /> : <Outlet />;
};

// const PrivateLayout = () => {
//   const isAuth = localStorage.getItem("token");
//   const location = useLocation();

//   if (!isAuth) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return (
//     <>
//       <BirthdayReminders />
//       <Outlet />
//     </>
//   );
// };

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<Root />}
        errorElement={<ErrorPage404 />}
        children={[
          <Route
            path="/"
            element={<HeroBlock />}
            errorElement={<ErrorPage404 />}
            children={[]}
          />,

          // <Route
          //   path="/spinner"
          //   element={<Spinner />}
          //   errorElement={<ErrorPage404 />}
          //   children={[]}
          // />,

          // <Route
          //   path="/friendaccept"
          //   element={<FriendAccept />}
          //   errorElement={<ErrorPage404 />}
          //   children={[]}
          // />,

          // <Route element={<PrivateRoute />}>
          //   <Route
          //     path="/wishlist"
          //     element={<Wishlist />}
          //     errorElement={<ErrorPage404 />}
          //     children={[]}
          //   />
          //   <Route
          //     path="/friends"
          //     element={<Friends />}
          //     errorElement={<ErrorPage404 />}
          //   />
          //   <Route
          //     path="/friends/add/:id"
          //     element={<FriendAccept />} // компонент, который примет id и вызовет acceptFriend
          //     errorElement={<ErrorPage404 />}
          //   />
          //   <Route
          //     path="/wishlist/:id"
          //     element={<FriendWishlist />}
          //     errorElement={<ErrorPage404 />}
          //   />
          // </Route>,

          <Route element={<PrivateRoute />}>
            <Route
              path="/wishlist"
              element={<Wishlist />}
              errorElement={<ErrorPage404 />}
              children={[]}
            />
            <Route
              path="/friends"
              element={<Friends />}
              errorElement={<ErrorPage404 />}
            />
            <Route
              path="/friends/add/:id"
              element={<FriendAccept />} // компонент, который примет id и вызовет acceptFriend
              errorElement={<ErrorPage404 />}
            />
            <Route
              path="/wishlist/:id"
              element={<FriendWishlist />}
              errorElement={<ErrorPage404 />}
            />
          </Route>,
        ]}
      />

      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={<Login />}
          errorElement={<ErrorPage404 />}
        />

        <Route
          path="/registration"
          element={<Registration />}
          errorElement={<ErrorPage404 />}
        />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
