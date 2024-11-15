import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import {LoginPage} from "./views/LoginPage.jsx"
import "./styles/global.css";
import { ErrorBlock } from "./components/ErrorBlock/ErrorBlock.jsx";

// import {createBrowserRouter , RouterProvider} from "react-router-dom"

// const router = createBrowserRouter([
//   {
//   // element: <p>hej</p>,
//   element: <LoginPage/>,
//   path:"/"
//   },
//   {
//   element: <p>wdawd</p>,
//   path:"/TransportApp"
//   },

// ])

createRoot(document.getElementById("root")).render(
	<StrictMode>
		{/* <RouterProvider router={router} />
		 */}
		
		<App />
		 
		{/* <ErrorBlock/> */}
		{/* <ModalAddTransport /> */}
	</StrictMode>
);
