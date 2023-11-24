import React from "react";
import { dAPP_METADATA } from "~/constants";

const LinkCollection = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full">
        <p className="text-sm text-slate-500">
          {new Date().getFullYear()} ©{dAPP_METADATA.name}
        </p>
      </div>
      <div className="flex flex-row">
        <a
          href={"https://github.com/ThianHooi/drive-lens"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Github
        </a>
        <span className="mx-2 text-sm text-slate-500">•</span>
        <a
          href={"https://www.lens.xyz/"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Lens Protocol
        </a>
      </div>
    </div>
  );
};

export default LinkCollection;
