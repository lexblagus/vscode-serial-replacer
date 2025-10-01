import ToInclude from "./ToInclude";
import ToExclude from "./ToExclude";
import Preview from "./Preview";

import type { FC } from "react";

const Files: FC = () => {
  console.log("▶ Files");

  return (
    <>
      <ToInclude />
      <ToExclude />
      <Preview />
    </>
  );
};

export default Files;
