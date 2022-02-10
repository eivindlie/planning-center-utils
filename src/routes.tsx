import { Route, Routes as BrowserRoutes } from "react-router-dom";
import { Teams } from "./components";

export const Routes = () => {
  return (
    <BrowserRoutes>
      <Route path={"/teams"} element={<Teams />} />
    </BrowserRoutes>
  );
};
