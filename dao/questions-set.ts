import { Provider } from "./provider";
import { QuestionsSet } from "../types/questions-set";

export const questionsSetDao = new Provider<QuestionsSet>("questions-set");
