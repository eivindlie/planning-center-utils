import { Route, Routes as BrowserRoutes } from "react-router-dom";
import { Teams } from "./components";
import { Blockouts } from "./components/Blockouts";

export const Routes = () => {
  return (
    <BrowserRoutes>
      <Route path={"/teams"} element={<Teams />} />
      <Route path={"/blockouts"} element={<Blockouts />} />
    </BrowserRoutes>
  );
};
