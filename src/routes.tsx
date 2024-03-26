import { Plans } from "components/plans/Plans";
import { Navigate, Route, Routes as BrowserRoutes } from "react-router-dom";
import { Teams } from "./components";
import { Blockouts } from "./components/blockout/Blockouts";
import { SongsWithoutCCLI } from "components/songs/SongsWithoutCCCLI";
import { Spotify } from "components/spotify/Spotify";

export const Routes = () => {
  return (
    <BrowserRoutes>
      <Route path="/" element={<Navigate to="/plans" />} />
      <Route path={"/teams"} element={<Teams />} />
      <Route path={"/blockouts"} element={<Blockouts />} />
      <Route path={"/plans"} element={<Plans />} />
      <Route path={"/ccli"} element={<SongsWithoutCCLI />} />
      <Route path={"/spotify"} element={<Spotify />} />
    </BrowserRoutes>
  );
};
