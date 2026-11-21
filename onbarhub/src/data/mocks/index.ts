import type { Mock } from "@/lib/exam";
import { professionalResponsibility, realEstate } from "./solicitor-originals";

// Register every mock here. All questions are The OnBar Hub's own original
// material. To add a set, export a `Mock` from a file in this folder, import it
// and add it to the array.
export const mocks: Mock[] = [professionalResponsibility, realEstate];

export function getMock(id: string): Mock | undefined {
  return mocks.find((m) => m.id === id);
}
