import { Dream } from "@/interfaces/dream.interface";
import { Settings } from "@/interfaces/settings.interface";
import { Session } from "@/interfaces/session.interface";

export interface State {
  limit: number;
  dreams: Dream[];
  dates: string[];
  sessions: Session[];
  settings: Settings;
}
