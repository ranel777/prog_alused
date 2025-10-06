class BulkTank {
  constructor(capacity = 2000) {
    this.capacity = capacity;
    this.volume = 0;
  }

  getCapacity() {
    return this.capacity;
  }

  getVolume() {
    return this.volume;
  }

  howMuchFreeSpace() {
    return this.capacity - this.volume;
  }

  addToTank(amount) {
    if (amount < 0) return;
    const free = this.howMuchFreeSpace();
    const toAdd = Math.min(amount, free);
    this.volume += toAdd;
  }

  getFromTank(amount) {
    if (amount < 0) return 0;
    const taken = Math.min(amount, this.volume);
    this.volume -= taken;
    return taken;
  }

  print() {
    const round = (x) => Math.ceil(x * 10) / 10;
    return `${round(this.volume).toFixed(1)}/${round(this.capacity).toFixed(1)}`;
  }
}

module.exports = BulkTank;

const NAMES = [
  "Anu", "Arpa", "Essi", "Heluna", "Hely",
  "Hento", "Hilke", "Hilsu", "Hymy", "Ihq", "Ilme", "Ilo",
  "Jaana", "Jami", "Jatta", "Laku", "Liekki",
  "Mainikki", "Mella", "Mimmi", "Naatti",
  "Nina", "Nyytti", "Papu", "Pullukka", "Pulu",
  "Rima", "Soma", "Sylkki", "Valpu", "Virpi"
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

class Cow {
  constructor(name) {
    if (!name) {
      name = NAMES[randomInt(0, NAMES.length - 1)];
    }
    this.name = name;
    this.capacity = randomInt(15, 40);
    this.amount = 0;
  }

  getName() {
    return this.name;
  }

  getCapacity() {
    return this.capacity;
  }

  getAmount() {
    return this.amount;
  }

  liveHour() {
    const produced = randomFloat(0.7, 2.0);
    this.amount = Math.min(this.capacity, this.amount + produced);
  }

  milk() {
    const milked = this.amount;
    this.amount = 0;
    return milked;
  }

  print() {
    const round = (x) => Math.ceil(x * 10) / 10;
    return `${this.name} ${round(this.amount).toFixed(1)}/${round(this.capacity).toFixed(1)}`;
  }
}

module.exports = Cow;

class MilkingRobot {
  constructor() {
    this.tank = null;
  }

  getBulkTank() {
    return this.tank;
  }

  setBulkTank(tank) {
    this.tank = tank;
  }

  milk(milkable) {
    if (!this.tank) {
      throw new Error("The MilkingRobot hasn't been installed");
    }
    const amount = milkable.milk();
    this.tank.addToTank(amount);
  }
}

module.exports = MilkingRobot;

class Barn {
  constructor(tank) {
    this.tank = tank;
    this.robot = null;
  }

  getBulkTank() {
    return this.tank;
  }

  installMilkingRobot(robot) {
    this.robot = robot;
    robot.setBulkTank(this.tank);
  }

  takeCareOf(cowOrCows) {
    if (!this.robot) {
      throw new Error("Milking robot hasn't been installed");
    }
    if (Array.isArray(cowOrCows)) {
      for (const cow of cowOrCows) {
        this.robot.milk(cow);
      }
    } else {
      this.robot.milk(cowOrCows);
    }
  }

  print() {
    return this.tank.print();
  }
}

module.exports = Barn;

class Farm {
  constructor(owner, barn) {
    this.owner = owner;
    this.barn = barn;
    this.cows = [];
  }

  getOwner() {
    return this.owner;
  }

  addCow(cow) {
    this.cows.push(cow);
  }

  liveHour() {
    for (const cow of this.cows) {
      cow.liveHour();
    }
  }

  manageCows() {
    this.barn.takeCareOf(this.cows);
  }

  installMilkingRobot(robot) {
    this.barn.installMilkingRobot(robot);
  }

  print() {
    let out = `Farm owner: ${this.owner}\nBarn bulk tank: ${this.barn.print()}\nAnimals:`;
    if (this.cows.length === 0) {
      out += "\n        No cows.";
    } else {
      for (const cow of this.cows) {
        out += `\n        ${cow.print()}`;
      }
    }
    return out;
  }
}

module.exports = Farm;
