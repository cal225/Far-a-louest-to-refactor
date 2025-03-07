import chalk, { ChalkInstance } from "chalk";

class Narator {
  private static readingSpeed: number = 0;

  static async speak(text: string) {
    await typeWriterEffect(text, this.readingSpeed, chalk.magenta);
  }

  static async dialog(text: string, type: "narrator" | "pnj" | "self") {
    const colors = {
      narrator: chalk.magenta,
      pnj: chalk.green,
      self: chalk.yellow,
    };

    await typeWriterEffect(text, this.readingSpeed, colors[type]);
  }
}

async function typeWriterEffect(text: string, speed: number, decorator: ChalkInstance) {
  for (const char of text) {
    process.stdout.write(decorator(char));
    await new Promise((resolve) => setTimeout(resolve, speed));
  }
  console.log();
}

export default Narator;
