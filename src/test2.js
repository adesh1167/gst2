class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    getName = () => {
        return this.name;
    }

    getAge = (name) => {
        return this.name;
    }

    changeName = (name) => {
        this.name = name;
    }

    increaseAge = (inc) => {
        this.age += inc || 1;
    }
}