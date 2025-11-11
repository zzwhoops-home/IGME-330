type Point = {
    x: number,
    y: number
};

let myPos: Point = {
    x: 13,
    y: 14
};

const translateByX = (amount: number, point: Point) : Point => {
    return {
        x: point.x + amount,
        y: point.y
    }
};

console.log("I'm at", myPos[3]);

enum CharacterClass {
    Elf,
    FightingMan,
    MagicUser
};

type Character = {
    name: string,
    character_class: CharacterClass,
    hp: number
};

const aGuy : Character = {
    name: 'Zach',
    character_class: CharacterClass.Elf,
    hp: 20
};

type Attack = {
    kind: 'evt-attack',
    damage: number
}

type Kill = {
    kind: 'evt-kill'
}

type Heal = {
    kind: 'evt-heal',
    amount: number
}

type ChangeClass = {
    kind: 'evt-change-class',
    new_class: CharacterClass
}

type CharacterEvents = Attack | Kill | Heal | ChangeClass;

const processEvent = (evt: CharacterEvents, character: Character) : Character => {
    if (evt.kind === 'evt-attack') {
        return {
            name: character.name,
            character_class: character.character_class,
            hp: character.hp - evt.damage
        };
    }
    if (evt.kind === 'evt-kill') {
        return {
            name: character.name,
            character_class: character.character_class,
            hp: 0
        };
    }
    if (evt.kind === 'evt-heal') {
        return {
            name: character.name,
            character_class: character.character_class,
            hp: character.hp + evt.amount
        };
    }
    if (evt.kind === 'evt-change-class') {
        return {
            name: character.name,
            character_class: evt.new_class,
            hp: character.hp
        };
    }

    return character;
};

// DANGER
// let newEvt = {
//     kind: 'evt-chorge-class',
//     newClass: CharacterClass.MagicUser
// } as any as ChangeClass;
// processEvent(newEvt, aGuy);

let firstHalf = <T>(arr: Array<T>) : Array<T> => {
    // return first half of array
    return arr.slice(0, arr.length / 2);
};

let arr = [1, 2, 3, 4, 5];
let result = firstHalf(arr);