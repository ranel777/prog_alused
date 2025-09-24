class MyDate {
    #day;
    #month;
    #year;

    constructor(day, month, year) {
        this.#day = day;
        this.#month = month;
        this.#year = year;
        this.isValid();
    }

    isValid() {
        if (!Number.isInteger(this.#day) || !Number.isInteger(this.#month) || !Number.isInteger(this.#year)) {
            console.log("Viga: päev, kuu ja aasta peavad olema täisarvud.");
            return false;
        }

        if (this.#month < 1 || this.#month > 12) {
            console.log("Viga: kuu peab olema vahemikus 1 kuni 12.");
            return false;
        }

        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let maxDay = daysInMonth[this.#month - 1];

        if (this.#day < 1 || this.#day > maxDay) {
            console.log(`Viga: päev peab olema vahemikus 1 kuni ${maxDay} antud kuus.`);
            return false;
        }

        return true;
    }

    printDay() {
        return `${this.#day}.${this.#month}.${this.#year}`;
    }

    earlier(compared) {
        if (this.#year < compared.#year) return true;
        if (this.#year > compared.#year) return false;
        if (this.#month < compared.#month) return true;
        if (this.#month > compared.#month) return false;
        if (this.#day < compared.#day) return true;
        return false;
    }
}

const d1 = new MyDate(1, 1, 2020);
const d2 = new MyDate(2, 1, 2020);
console.log(d1.printDay()); // 1.1.2020
console.log(d1.earlier(d2)); // true
