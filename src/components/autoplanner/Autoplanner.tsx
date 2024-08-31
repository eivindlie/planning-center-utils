import { Button } from "components/_basis/Button";
import { solve } from "utils/autoplanner";

export const Autoplanner = () => {
  return (
    <div>
      <Button onClick={() => solve()}>Run GA</Button>
    </div>
  );
};
