import { useContext } from "react";
import { LensAuthContext } from "../providers/LensAuthProvider";
import { type LensAuth } from "../types/lens-auth";

const useLensAuth = (): LensAuth => {
  const ctx = useContext(LensAuthContext);

  return ctx;
};

export default useLensAuth;
