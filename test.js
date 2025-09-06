function greet(name) {
  return `Hello, ${name}!`;
}

const add = (a, b) => a + b;

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    console.log(`Hi, I'm ${this.name} and I am ${this.age} years old.`);
  }
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetching data failed:", error);
    return null;
  }
}
