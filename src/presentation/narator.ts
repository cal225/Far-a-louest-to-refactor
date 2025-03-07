import chalk, { ChalkInstance } from "chalk";

class Narator {
  private static readingSpeed: number = 0;

  static async speak(text: string) {
    await typeWriterEffect(text, this.readingSpeed, chalk.magenta);
  }

  static async dialog(text: string, type: "narrator" | "pnj" | "self") {
    const colors: Record<string, ChalkInstance> = {
      narrator: chalk.magenta,
      pnj: chalk.green,
      self: chalk.yellow,
    };

    if (!colors[type]) throw new Error("Unknown dialog type");

    await typeWriterEffect(text, this.readingSpeed, colors[type]);
  }
}

async function typeWriterEffect(
  text: string,
  speed: number,
  decorator: ChalkInstance
) {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const char of text) {
    process.stdout.write(decorator(char));
    await delay(speed);
  }
  process.stdout.write("\n"); // Ensures new line after typing
}

export default Narator;
