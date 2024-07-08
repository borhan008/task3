var { AsciiTable3 } = require("ascii-table3");
const readline = require("readline-sync");
const crypto = require("crypto");

class ComputerMove {
  constructor(num) {
    this.move = Math.floor(Math.random() * (num - 1) + 1);
    this.key = crypto.randomBytes(24).toString("hex");
    this.hmaccode = crypto
      .createHmac("sha256", this.key)
      .update(this.move.toString())
      .digest("hex");
    console.log("HMAC: ", this.hmaccode);
  }
}

class GameRule {
  constructor(args) {
    this.args = args;
  }
  display() {
    console.log("Available Move:");
    for (let i = 0; i < args.length; i++) {
      console.log(`${i + 1} - ${args[i]}`);
    }
    console.log("? - Help");
    console.log("0 - Exit");
  }
}

class GameTable {
  constructor(arg) {
    this.args = arg;
  }

  calc() {
    let arr = [];
    for (let i = 0; i < args.length; i++) {
      arr[i] = [];
      arr[i][0] = args[i];
      let k = (args.length - 1) / 2;
      for (let j = i + 1; ; j++) {
        if (j == args.length) j = 0;
        if (j == i) break;
        if (k > 0) {
          arr[i][j + 1] = "Win";
          k--;
        } else {
          arr[i][j + 1] = "Lose";
        }
      }
      arr[i][i + 1] = "Draw";
    }
    return arr;
  }
}

class ShowTable extends GameTable {
  constructor(arg) {
    super(arg);
  }
  display() {
    let arr = this.calc();
    var table = new AsciiTable3("Help Table")
      .setHeading("User | Computer > ", ...args)
      .addRowMatrix(arr);

    console.log(table.toString());
  }
}

class GameResult extends GameTable {
  constructor(arg) {
    super(arg);
  }

  result(move) {
    let arr = this.calc();
    let user = readline.question("Your Move: ");
    if (user == "?") {
      new ShowTable(args).display();
      return 2;
    }
    if (user == 0) {
      console.log("Game Over");
      return -1;
    } else if (isNaN(user) || user < 0 || user > args.length) {
      console.log("Invalid Move. Try Again.");
      return 0;
    } else {
      console.log("Computer Move: ", move);
      console.log(arr[user - 1][move]);
      return 1;
    }
  }
}

const args = process.argv.slice(2);

if (args.length < 3) {
  console.log("Moves are less 3. It should be greater than 2 and odd.");
  return;
}
if (args.length % 2 == 0) {
  console.log("Moves are even. It should be odd.");
  return;
}
let pos = true;
args.forEach((element, index) => {
  if (args.indexOf(element) != index) {
    console.log(
      "Duplicate elements found. There should be no duplicate element."
    );
    pos = false;
    return;
  }
});
if (!pos) return;
let computer = new ComputerMove(args.length);

const game = new GameRule(args);
game.display();
const gameresult = new GameResult(args);

while (true) {
  let res = gameresult.result(computer.move);
  if (res == -1) return;
  else if (res == 2) {
    game.display();
  } else if (res == 0) {
    game.display();
  } else {
    console.log("HMAC Key: ", computer.key, "\n");
    computer = new ComputerMove(args.length);
    game.display();
  }
}
