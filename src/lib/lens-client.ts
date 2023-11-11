import { LensClient, development } from "@lens-protocol/client";

const lensClient = new LensClient({
  environment: development,
});

export default lensClient;
