class Character {
    constructor({dnd_class = "peasant", hp = 10, equipment = []}) {
        // this.dnd_class = dnd_class;
        // this.hp = hp;
        // this.equipment = equipment;

        Object.assign(this, {
            dnd_class,
            hp,
            equipment
        })

        // alternatively:
        // Object.assign(this, {
        //     dnd_class: dnd_class,
        //     hp: hp,
        //     equipment: equipment
        // })
    }

    give(item) {
        this.equipment.push(item);
        return this.equipment;
    }
}

// const Character = (dnd_class, hp, equipment) => {
//     return {
//         dnd_class,
//         hp,
//         equipment,
//         give(item) {
//             this.equipment.push(item);
//             return this.equipment;
//         }
//     }
// }

let zardul = new Character({
        'dnd_class': 'wizard',
        'hp': 12,
        'equipment': ['staff']
    }
);
let scholarlyBrother = new Character({
        'dnd_class': 'barbarian',
        'age': 20,
        'equipment': ['axe']
    }
);

// let zardul = Character('wizard', 12, ['staff']);
// let scholarlyBrother = Character('barbarian', 20, ['axe']);

scholarlyBrother.give("necklace");
console.log(scholarlyBrother);

const mergeObjects = (obj1, obj2) => {
    // let merged = {};

    // Object.keys(obj1).forEach(key => {
    //     merged[key] = obj1[key];
    // })
    // Object.keys(obj2).forEach(key => {
    //     merged[key] = obj2[key];
    // })

    // return merged;

    // same thing:
    // return Object.assign({}, obj1, obj2);

    // still the same thing
    return { ...obj1, ...obj2 };
};

const leveledUp = mergeObjects({dnd_class: 'barbarian'}, {hp: 100});
console.log(leveledUp);