class Person {
  #weight; // kaal (kg)
  #height; // pikkus (m)

  constructor(height, weight) {
    this.setWeight(weight);
    this.setHeight(height);
  }

  setWeight(weight) {
    if (weight > 0) {
      this.#weight = weight;
    } else {
      throw new Error("Kaal peab olema suurem kui 0!");
    }
  }

  setHeight(height) {
    if (height > 0) {
      this.#height = height;
    } else {
      throw new Error("Pikkus peab olema suurem kui 0!");
    }
  }

  getBMI() {
    if (this.#weight > 0 && this.#height > 0) {
      const bmi = this.#weight / (this.#height * this.#height);
      return Number(bmi.toFixed(2));
    } else {
      throw new Error("Kaal ja pikkus peavad olema määratud ja suuremad kui 0!");
    }
  }
}

// Näide kasutamisest:
try {
  const pikkus = 1.75; // meetrites
  const kaal = 20 * pikkus * pikkus; // 61.25 kg, et saada BMI 20.00
  const inimene = new Person(pikkus, kaal);
  console.log("BMI:", inimene.getBMI().toFixed(2)); // BMI: 20.00
} catch (e) {
  console.error(e.message);
}
