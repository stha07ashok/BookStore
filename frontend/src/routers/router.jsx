import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckOutPage from "../pages/books/CheckOutPage";
import SingleBook from "../pages/books/SingleBook";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/books/OrderPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import UpdateBook from "../pages/dashboard/EditBook/UpdateBook";
import AddBook from "../pages/dashboard/addBook/AddBook";
import BookSell from "../pages/books/BookSell";
import GetAllOrders from "../pages/dashboard/GetAllOrders/GetAllOrdersUnderEmail";
import ViewSoldBook from "../pages/books/ViewSoldBook";
import SoldOldBooks from "../pages/dashboard/SoldOldBooks/SoldbookEmailcard";
import History from "../pages/books/History";
import OrdersByEmail from "../pages/dashboard/GetAllOrders/GetOrderInEmailCard";
import SoldBooksByEmail from "../pages/dashboard/SoldOldBooks/AllSoldBookUnderEmail";
import Success from "../components/Success";
import Failure from "../components/Failure";
import Paymentform from "../components/Paymentform";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/about",
        element: <div>About</div>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/sell",
        element: (
          <PrivateRoute>
            <BookSell />
          </PrivateRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <CheckOutPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/book/:id",
        element: <SingleBook />,
      },
      {
        path: "/sold-old-books",
        element: (
          <PrivateRoute>
            <ViewSoldBook />,
          </PrivateRoute>
        ),
      },
      {
        path: "/history",
        element: (
          <PrivateRoute>
            <History />,
          </PrivateRoute>
        ),
      },
      {
        path: "/payment-success",
        element: (
          // <PrivateRoute>
          <Success />
          // </PrivateRoute>
        ),
      },
      {
        path: "/payment-failure",
        element: (
          //<PrivateRoute>
          <Failure />
          //</PrivateRoute>
        ),
      },
      {
        path: "/payment-form",
        element: (
          //  <PrivateRoute>
          <Paymentform />
          // </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        ),
      },
      {
        path: "add-new-book",
        element: (
          <AdminRoute>
            <AddBook />
          </AdminRoute>
        ),
      },
      {
        path: "edit-book/:id",
        element: (
          <AdminRoute>
            <UpdateBook />
          </AdminRoute>
        ),
      },
      {
        path: "manage-books",
        element: (
          <AdminRoute>
            <ManageBooks />
          </AdminRoute>
        ),
      },
      {
        path: "getallorders",
        element: (
          <AdminRoute>
            <GetAllOrders />
          </AdminRoute>
        ),
      },
      {
        path: "soldoldbooks",
        element: (
          <AdminRoute>
            <SoldOldBooks />
          </AdminRoute>
        ),
      },
      {
        path: "orderbyemail/:email",
        element: (
          <AdminRoute>
            <OrdersByEmail />
          </AdminRoute>
        ),
      },
      {
        path: "soldoldbooksbyemail/:email",
        element: (
          <AdminRoute>
            <SoldBooksByEmail />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
