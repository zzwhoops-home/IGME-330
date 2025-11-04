import { formatName, slowFormat } from "./utils.js";

const name = formatName({
    first: 'Zachary',
    last: 'Deng'
})

(async () => {
    const name = slowFormat({
        first: "Jack",
        last: "Doe"
    });
    console.log(name);
});

console.log(name);
