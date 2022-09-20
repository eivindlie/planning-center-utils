import { Plans } from "components/plans/Plans";
import { Navigate, Route, Routes as BrowserRoutes } from "react-router-dom";
import { Teams } from "./components";
import { Blockouts } from "./components/blockout/Blockouts";

export const Routes = () => {
  return (
    <BrowserRoutes>
      <Route path="/" element={<Navigate to="/blockouts" />} />
      <Route path={"/teams"} element={<Teams />} />
      <Route path={"/blockouts"} element={<Blockouts />} />
      <Route path={"/plans"} element={<Plans />} />
    </BrowserRoutes>
  );
};
