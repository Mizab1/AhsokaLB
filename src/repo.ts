import {
  summon,
  rel,
  NBT,
  give,
  Selector,
  _,
  execute,
  setblock,
  tp,
  kill,
} from "sandstone";
import { typeOfLuckyBlocks } from "./main";

const self = Selector("@s");

// * Generic Functions
/**
 * Give the actual block item to the player
 *
 * @param name             name or tag that will be given to endermite
 * @param customModelData  custom model data of the display item
 */
export const giveLuckyBlock = (
  name: string,
  tagName: string,
  customModelData: number
) => {
  give(
    "@s",
    "minecraft:endermite_spawn_egg" +
      `{display:{Name:'{"text":"${name}","color":"gold","italic":false}'}, CustomModelData:${customModelData},EntityTag:{Silent:1b,NoAI:1b,Tags:["lb.${tagName}","lb.endermite"],ActiveEffects:[{Id:14b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}}`,
    1
  );
};

// * internal functions
/* Placing Blocks */
export const placeLuckyBlockInTheWorld = () => {
  // Place the custom block when user places the block from the client side
  execute
    .as(Selector("@e", { type: "minecraft:endermite", tag: "lb.endermite" }))
    .at(self)
    .run(() => {
      // Iterate over the array, value is the object of the lucky block
      typeOfLuckyBlocks.forEach((value) => {
        execute.if(Selector("@s", { tag: `lb.${value.name}` })).run(() => {
          placeLuckyBlock(value.name, value.customModelData);
        });
      });
    });
};
/**
 * place the lucky block when the player uses the endermite spawn egg
 *
 * @param name name of the lucky block, which will be given to the armor stand
 * @param customModelData CustomModelData for the endermite spawn egg (same as the display texture)
 */
export const placeLuckyBlock = (name: string, customModelData: number) => {
  summon("minecraft:armor_stand", rel(0, 0, 0), {
    NoGravity: NBT.byte(1),
    Invisible: NBT.byte(1),
    Tags: [`lb.${name}`, `lb.aS`],
    ArmorItems: [
      {},
      {},
      {},
      {
        id: "minecraft:endermite_spawn_egg",
        Count: NBT.byte(1),
        tag: {
          CustomModelData: customModelData,
        },
      },
    ],
  });
  setblock(rel(0, 0, 0), "minecraft:glass");
  tp(self, rel(0, -600, 0));
};

/* Validating breaking the block */
/**
 * This function validates if the block has been broken
 *
 * @param armorStandTagName Tag name of the armor stand that is listening for the event (same as the name of the lucky block)
 * @param cf callback function
 */
export const validateBreaking = (armorStandTagName: string, cf) => {
  execute
    .as(Selector("@e", { type: "minecraft:armor_stand", tag: "lb.aS" }))
    .at(self)
    .run(() => {
      execute.if(Selector("@s", { tag: `lb.${armorStandTagName}` })).run(() => {
        // Actual break detection
        execute.unless(_.block(rel(0, 0, 0), "minecraft:glass")).run(() => {
          // Do the actual logic here
          cf();
          kill(self);
        });
      });
    });
};
