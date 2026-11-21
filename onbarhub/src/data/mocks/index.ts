import type { Mock } from "@/lib/exam";
import { solicitorStarter } from "./solicitor-starter";

// Register every mock here. To add one of our vetted mocks, create a new file
// in this folder exporting a `Mock`, import it, and add it to the array.
export const mocks: Mock[] = [solicitorStarter];

export function getMock(id: string): Mock | undefined {
  return mocks.find((m) => m.id === id);
}
