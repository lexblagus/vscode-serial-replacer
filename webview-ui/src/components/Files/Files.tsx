import ToInclude from "./ToInclude";
import ToExclude from "./ToExclude";
import Preview from "./Preview";
import { log } from "../../utils/log";

import type { FC } from "react";

const Files: FC = () => {
  log('component', "Files", 'log', 'rendered');

  return (
    <>
      <ToInclude />
      <ToExclude />
      <Preview />
    </>
  );
};

export default Files;
