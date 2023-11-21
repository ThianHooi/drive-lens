export enum MissionType {
  FIRST_POST = "FIRST_POST",
  FIRST_COMMENT = "FIRST_COMMENT",
}

export type MissionStatus = {
  [key in MissionType]: boolean;
};

export type MissionContextType = {
  status: MissionStatus;
  completeTask: (type: MissionType) => Promise<void>;
};
