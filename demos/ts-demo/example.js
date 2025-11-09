var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var myName = 'zach';
var age = 3;
var add = function (a, b) {
    if (a > b) {
        return 'greater than';
    }
    return a + b;
};
var result = add(2, 1);
console.log(result);
// option 2
var PersonClass = /** @class */ (function () {
    function PersonClass(name, age) {
        this.name = name;
        this.age = age;
    }
    return PersonClass;
}());
var printPerson = function (person) {
    var personString = "".concat(person.name, " is ").concat(person.age, " years old.");
    return personString;
};
var me = {
    name: 'zach',
    age: 20
};
console.log(printPerson(me));
var game = {
    points: 0,
    playerName: 'zach',
    currentPage: 0,
};
var goToNextPage = function (game) {
    return __assign(__assign({}, game), { currentPage: game.currentPage + 1 });
};
var newGame = goToNextPage(game);
console.log(newGame);
