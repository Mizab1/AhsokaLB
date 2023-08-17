import {
  MCFunction,
  Objective,
  ObjectiveInstance,
  Score,
  Selector,
  _,
  abs,
  data,
  effect,
  execute,
  give,
  kill,
  particle,
  rel,
  say,
  sleep,
  summon,
  tag,
  tellraw,
} from "sandstone";
import {
  giveLuckyBlock,
  placeLuckyBlockInTheWorld,
  validateBreaking,
} from "./repo";
import { uniform } from "./lib/uniform";
import { pickRandom } from "./loots";
import { ConditionClass } from "sandstone/variables";
import { pushBack } from "./util/pushBack";
import { carrotOnAStickItemsLogic, enderPearlItemsLogic } from "./items/main";

const self = Selector("@s");

// ** Scores & Variables ** //
const internal: ObjectiveInstance = Objective.create("internal", "dummy");
const usedEnderPearlObj: ObjectiveInstance = Objective.create(
  "used_ender_pearl",
  "minecraft.used:minecraft.ender_pearl"
);
const usedCarrotOnAStickObj: ObjectiveInstance = Objective.create(
  "used_coas",
  "minecraft.used:minecraft.carrot_on_a_stick"
);
export const playerUsedEnderPearl: Score = usedEnderPearlObj("@s");
export const playerUsedCarrotOnAStick: Score = usedCarrotOnAStickObj("@s");
export const rng: Score = internal("rng");

/* Array of types of Lucky Blocks and its type */
type luckyBlockData = {
  name: string;
  customModelData: number;
};
export const typeOfLuckyBlocks: luckyBlockData[] = [
  { name: "ahsoka", customModelData: 110001 },
];

// ** Game functions **//
MCFunction(
  "tick",
  () => {
    // Place the lucky block in the world
    placeLuckyBlockInTheWorld();

    // Handler for when the player breaks the lucky block
    validateBreaking(typeOfLuckyBlocks[0].name, () => {
      particle(
        "minecraft:totem_of_undying",
        rel(0, 0, 0),
        [0.3, 0.3, 0.3],
        0.1,
        100
      );
      summon("minecraft:firework_rocket", rel(0, 0.5, 0), {
        LifeTime: 20,
      });
      pickRandom();
    });

    // Logic related to ender pearl based custom items
    enderPearlItemsLogic();

    // Logic related to Carrot on a stick based custom items
    carrotOnAStickItemsLogic();
  },
  {
    runEachTick: true,
  }
);

// ** User defined functions **//
MCFunction("give_lb", () => {
  giveLuckyBlock(
    "Ahsoka Tano Lucky Block",
    typeOfLuckyBlocks[0].name,
    typeOfLuckyBlocks[0].customModelData
  );
});

/* Basically this function check if the player is wearing the specified armor and if true, the function gives powerups */
MCFunction(
  "armor_effect",
  () => {
    let isWearingAhsokaHelmet: ConditionClass = _.data.entity(
      self,
      "Inventory[{Slot:103b}].tag.ahsoka_helmet"
    );
    let isWearingAhsokaChestplate: ConditionClass = _.data.entity(
      self,
      "Inventory[{Slot:102b}].tag.ahsoka_chestplate"
    );
    let isWearingAhsokaLeggings: ConditionClass = _.data.entity(
      self,
      "Inventory[{Slot:101b}].tag.ahsoka_leggings"
    );
    let isWearingAhsokaBoots: ConditionClass = _.data.entity(
      self,
      "Inventory[{Slot:100b}].tag.ahsoka_boots"
    );

    // execute as @a if data entity @s Inventory[{Slot:103b}].tag.ahsoka_helmet run say hi <- Command to rewrite
    execute
      .as("@a")
      .if(isWearingAhsokaHelmet)
      .if(isWearingAhsokaChestplate)
      .if(isWearingAhsokaLeggings)
      .if(isWearingAhsokaBoots)
      .run(() => {
        effect.give(self, "minecraft:jump_boost", 1, 4, true);
        effect.give(self, "minecraft:speed", 1, 2, true);
      });
  },
  {
    runEach: "5t",
  }
);
