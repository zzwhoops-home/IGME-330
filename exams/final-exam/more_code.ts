// type Creature = {
//     id: number,
//     name: string
// };

// const processCreatures = (creatureArr: Array<Creature>): number => {
//     return 0;
// };

type Biome = "Forest" | "Mountain" | "Desert" | "Water" | "Urban";
type AcceptedFiles = ".png" | ".jpg" | "webp";
type Path = `https://${string}.${AcceptedFiles}`;
type DangerLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type Creature = {
    name: string,
    description: string,
    image: Path,
    dangerLevel: DangerLevel,
    isLegendary: boolean,
    biome: Biome
}