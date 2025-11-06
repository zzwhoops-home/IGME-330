let myName: string = 'zach';
let age: number = 3;

const add = (a: number, b: number) : number | string => {
    if (a > b) {
        return 'greater than';
    }
    return a + b;
};

let result = add(2, 1);
console.log(result);

// option 1
type Person = {
    name: string,
    age: number
}

// option 1a
interface PersonInterface {
    name: string,
    age: number
}

// option 2
class PersonClass {
    name: string;
    age: number;

    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

const printPerson = (person: Person) => {
    let personString = `${person.name} is ${person.age} years old.`;
    return personString;
};

let me = {
    name: 'zach',
    age: 20
}

console.log(printPerson(me));

enum Pages {
    start,
    choose_character,
    playing,
    end
}

type Game = {
    points: number,
    playerName: string,
    currentPage: Pages
}

let game: Game = {
    points: 0,
    playerName: 'zach',
    currentPage: Pages.start
}

const goToNextPage = (game: Game) : Game => {
    return {
        ...game,
        currentPage: game.currentPage + 1,
    } as Game; // doesn't necessarily check if you're returning a Game type
}

const goToPage = (page: Pages, game: Game): Game => {
    return {
        ...game,
        currentPage: page
    }
};

const newGame = goToPage(Pages.choose_character, game);
console.log(newGame);