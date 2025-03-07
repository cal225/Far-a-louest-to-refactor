import { customAlphabet } from "nanoid";

// Option to customize the length of the ID and the characters used
export class IdGeneratorService {
  private nanoid;

  constructor(
    length: number = 10,
    alphabet: string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  ) {
    this.nanoid = customAlphabet(alphabet, length);
  }

  // Method to generate a random ID
  generateId(): string {
    return this.nanoid();
  }

  // Method to generate an ID with a prefix (for distinguishing different ID types)
  generateIdWithPrefix(prefix: string): string {
    return `${prefix}-${this.nanoid()}`;
  }
}
