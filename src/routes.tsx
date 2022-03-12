import { Plans } from "components/plans/Plans";
import { Route, Routes as BrowserRoutes } from "react-router-dom";
import { Teams } from "./components";
import { Blockouts } from "./components/blockout/Blockouts";

export const Routes = () => {
  return (
    <BrowserRoutes>
      <Route path={"/teams"} element={<Teams />} />
      <Route path={"/blockouts"} element={<Blockouts />} />
      <Route path={"/plans"} element={<Plans />} />
    </BrowserRoutes>
  );
};
