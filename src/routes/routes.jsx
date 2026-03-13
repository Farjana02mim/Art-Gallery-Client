import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/Homepage";
import Signup from "../pages/Signup";
import Signin from "../pages/Login";
import AddListing from "../pages/AddListing";
import ListingDetails from "../pages/ListingDetails";
import PrivateRoute from "../privateRoute/PrivateRoute";
import NotFound from "../pages/NotFound";
import CategoryFilteredProducts from "../pages/CategoryFilteredProducts";
import HomeExtras from "../components/HomeExtras";
import ArtworksGallery from "../pages/ArtworksGallery";
import DashboardLayout from "../layout/DashboardLayout";
import MyArts from "../pages/Dashboard/MyArts/MyArts";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import Coverage from "../pages/Coverage/Coverage";
import UpdateArt from "../pages/Dashboard/MyArts/UpdateArt";
import MyPurchases from "../components/MyPurchases";
import Artists from "../pages/Artists/Artists";
import Artist from "../pages/Artists/Artist";
import ArtistDetails from "../pages/Artists/ArtistDetails";
import ApproveArtists from "../pages/Dashboard/ApproveArtists/ApproveArtists";
import UsersManagement from "../pages/Dashboard/UsersManagement/UsersManagement";
import AdminRoute from "./AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/gallery", element: <ArtworksGallery /> },
      { path: "/category-filtered-product/:categoryName", element: <CategoryFilteredProducts /> },
      { path: "/signup", element: <Signup /> },
      { path: "/signin", element: <Signin /> },
      { path: "/artist", 
        element: (
          <PrivateRoute><Artist></Artist></PrivateRoute> 
        )
      },
       { path: "/artists", 
        element: (
          <PrivateRoute><Artists></Artists></PrivateRoute> 
        )
      },
      {
  path: "/artists/:id",
  element: <PrivateRoute><ArtistDetails></ArtistDetails></PrivateRoute> 
},
      {
        path: "/add-listing",
        element: (
          <PrivateRoute>
            <AddListing />
          </PrivateRoute>
        ),
      },
      {
        path: "/listing-details/:id",
        element: (
          <PrivateRoute>
            <ListingDetails />
          </PrivateRoute>
        ),
      },
      {
        path: 'coverage',
        Component: Coverage,
        loader: () => fetch('/serviceCenters.json').then(res=>res.json())
      },
      
    ],
  },

{
  path: "dashboard",
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    {
      path: "my-arts",
      Component: MyArts,
    },
    {
      path: "update-art/:id",   // fixed
      element: <UpdateArt />
    },
    {
      path: "my-purchases",     // fixed
      Component: MyPurchases
    },
    {
      path: "payment/:artId",
      Component: Payment
    },
    {
      path: "payment-success",
      Component: PaymentSuccess
    },
    {
      path: "payment-cancelled",
      Component: PaymentCancelled
    },
    {
      path: "approve-artists",
      element: <AdminRoute><ApproveArtists></ApproveArtists></AdminRoute>
    },
    {
      path: "users-management",
      element: <AdminRoute><UsersManagement></UsersManagement></AdminRoute>
    }
  ]
},

  // 404 Page route outside MainLayout
  { path: "*", element: <NotFound /> },
]);
