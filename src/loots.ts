import {
  LootTable,
  LootTableInstance,
  MCFunction,
  MCFunctionInstance,
  NBT,
  Selector,
  _,
  effect,
  execute,
  fill,
  functionCmd,
  give,
  kill,
  loot,
  rel,
  say,
  setblock,
  spreadplayers,
  summon,
  tellraw,
  time,
} from "sandstone";
import { rng } from "./main";
import { uniform } from "./lib/uniform";
import { invisibilityItemNBT } from "./items/main";

const self = Selector("@s");

// Repo for bad loots which can be obtained from the lucky block
const availableBadLoots: string[] = [
  "zombie_horde",
  "lava",
  "prison",
  "spawn_slime",
  "spawn_magma",
  "spawn_witch",
  "spawn_skeleton_jokey",
  "op_zombie",
  "bad_effects",
  "look_up_trap",
  "illusioner_trap",
  "evoker_trap",
  "wither_trap",
  "tnt_trap",
  "lightning_bolt_trap",
];
let badLootsCounter: number = 0; // Counter for available loots for file naming purposes

// Pick a random event
export const pickRandom: MCFunctionInstance = MCFunction(
  "loots/pick_random",
  () => {
    loot.spawn(rel(0, 0, 0)).loot(randomLoot.toString());
    execute
      .as(Selector("@e", { type: "minecraft:item", distance: [Infinity, 3] }))
      .at(self)
      .if(_.data.entity(self, "Item.tag.bad_loot"))
      .run(() => {
        rng.set(uniform(0, availableBadLoots.length - 1));
        availableBadLoots.forEach((value, i) => {
          // ! Change the name space if edited
          execute.if(rng.equalTo(i)).run.functionCmd(`default:loots/${value}`);
        });
        kill(self);
        rng.set(0);
      });
  }
);

// * GOOD LOOTS
LootTable(`loots/basic_tools`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:wooden_sword",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:wooden_axe",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:wooden_pickaxe",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:golden_sword",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:golden_axe",
        },
      ],
    },
  ],
});
LootTable(`loots/basic_armor`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:leather_helmet",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:leather_chestplate",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:leather_leggings",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:leather_boots",
        },
      ],
    },
  ],
});
LootTable(`loots/iron_armor`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:iron_helmet",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:iron_chestplate",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:iron_leggings",
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:iron_boots",
        },
      ],
    },
  ],
});
LootTable(`loots/enchanted_tools`, {
  type: "generic",
  pools: [
    {
      rolls: 2,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:sequence",
          children: [
            {
              type: "minecraft:item",
              name: "minecraft:diamond_axe",
              functions: [
                {
                  function: "enchant_randomly",
                  enchantments: [],
                },
              ],
            },
            {
              type: "minecraft:item",
              name: "minecraft:diamond_sword",
              functions: [
                {
                  function: "enchant_randomly",
                  enchantments: [],
                },
              ],
            },
            {
              type: "minecraft:item",
              name: "minecraft:diamond_helmet",
              functions: [
                {
                  function: "enchant_randomly",
                  enchantments: [],
                },
              ],
            },
            {
              type: "minecraft:item",
              name: "minecraft:diamond_chestplate",
              functions: [
                {
                  function: "enchant_randomly",
                  enchantments: [],
                },
              ],
            },
            {
              type: "minecraft:item",
              name: "minecraft:diamond_leggings",
              functions: [
                {
                  function: "enchant_randomly",
                  enchantments: [],
                },
              ],
            },
            {
              type: "minecraft:item",
              name: "minecraft:diamond_boots",
              functions: [
                {
                  function: "enchant_randomly",
                  enchantments: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/tame_dog`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:wolf_spawn_egg",
          functions: [
            {
              function: "set_count",
              count: 4,
            },
          ],
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:bone",
          functions: [
            {
              function: "set_count",
              count: 32,
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/rare_blocks`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:diamond_block",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 1,
                max: 3,
              },
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:gold_block",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 1,
                max: 3,
              },
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:netherite_block",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 1,
                max: 3,
              },
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:iron_block",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 1,
                max: 3,
              },
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/bow`, {
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:bow",
          functions: [
            {
              function: "enchant_randomly",
              enchantments: [],
            },
            {
              function: "enchant_randomly",
              enchantments: [],
            },
          ],
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:arrow",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 8,
                max: 64,
              },
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/ender_pearl`, {
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:ender_pearl",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 1,
                max: 8,
              },
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/sponge`, {
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:sponge",
          functions: [
            {
              function: "set_count",
              count: 1,
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/enchanted_golden_apple`, {
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:enchanted_golden_apple",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 1,
                max: 4,
              },
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/golden_apple`, {
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:golden_apple",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 1,
                max: 8,
              },
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/potions`, {
  pools: [
    {
      rolls: 3,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:splash_potion",
          functions: [
            {
              // @ts-ignore
              function: "minecraft:set_potion",
              id: "minecraft:healing",
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:splash_potion",
          functions: [
            {
              // @ts-ignore
              function: "minecraft:set_potion",
              id: "minecraft:harming",
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:splash_potion",
          functions: [
            {
              // @ts-ignore
              function: "minecraft:set_potion",
              id: "minecraft:invisibility",
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:splash_potion",
          functions: [
            {
              // @ts-ignore
              function: "minecraft:set_potion",
              id: "minecraft:leaping",
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:splash_potion",
          functions: [
            {
              // @ts-ignore
              function: "minecraft:set_potion",
              id: "minecraft:poison",
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:splash_potion",
          functions: [
            {
              // @ts-ignore
              function: "minecraft:set_potion",
              id: "minecraft:strong_swiftness",
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:splash_potion",
          functions: [
            {
              // @ts-ignore
              function: "minecraft:set_potion",
              id: "minecraft:strength",
            },
          ],
        },
      ],
    },
  ],
  functions: [
    {
      function: "set_count",
      count: {
        type: "uniform",
        min: 3,
        max: 6,
      },
    },
  ],
});
LootTable(`loots/horse`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:horse_spawn_egg",
          functions: [
            {
              function: "set_nbt",
              tag: '{display:{Name:\'{"text":"Tamed Horse Spawn Egg","italic":false}\'},EntityTag:{Tame:1b,CustomName:\'{"text":"Horse"}\',SaddleItem:{id:"minecraft:saddle",Count:1b},ArmorItem:{}}}',
            },
          ],
        },
      ],
      functions: [
        {
          function: "set_count",
          count: {
            type: "uniform",
            min: 1,
            max: 3,
          },
        },
      ],
    },
  ],
});
LootTable(`loots/foods`, {
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:cooked_beef",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 6,
                max: 25,
              },
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:cooked_chicken",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 6,
                max: 25,
              },
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:cooked_mutton",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 6,
                max: 25,
              },
            },
          ],
        },
        {
          type: "minecraft:item",
          name: "minecraft:bread",
          functions: [
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 6,
                max: 25,
              },
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/ahsoka_tano_light_saber`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:netherite_sword",
          functions: [
            {
              function: "set_nbt",
              tag: `{display:{Name:'{"text":"Ashoka Tano\\'s Light Saber","color":"gold","italic":false}'},HideFlags:255,Unbreakable:1b,CustomModelData:100001,Enchantments:[{id:"minecraft:sharpness",lvl:7s},{id:"minecraft:knockback",lvl:1s},{id:"minecraft:fire_aspect",lvl:1s}],AttributeModifiers:[{AttributeName:"generic.attack_speed",Name:"generic.attack_speed",Amount:2,Operation:2,UUID:[I;1261247379,-1168358935,-1906785588,-61268182]},{AttributeName:"generic.movement_speed",Name:"generic.movement_speed",Amount:0.5,Operation:1,UUID:[I;-2001857077,326846995,-1933569876,427536912]}]}`,
            },
          ],
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:netherite_sword",
          functions: [
            {
              function: "set_nbt",
              tag: `{display:{Name:'{"text":"Ashoka Tano\\'s Light Saber","color":"gold","italic":false}'},HideFlags:255,Unbreakable:1b,CustomModelData:100001,Enchantments:[{id:"minecraft:sharpness",lvl:7s},{id:"minecraft:knockback",lvl:1s},{id:"minecraft:fire_aspect",lvl:1s}],AttributeModifiers:[{AttributeName:"generic.attack_speed",Name:"generic.attack_speed",Amount:2,Operation:2,UUID:[I;1261247379,-1168358935,-1906785588,-61268182]},{AttributeName:"generic.movement_speed",Name:"generic.movement_speed",Amount:0.5,Operation:1,UUID:[I;-2001857077,326846995,-1933569876,427536912]}]}`,
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/ahsoka_tano_armor`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:netherite_helmet",
          functions: [
            {
              function: "set_nbt",
              tag: `{display:{Name:'{"text":"Ahsoka Tano\\'s Helmet","color":"gold","italic":false}'},HideFlags:255,ahsoka_helmet:1b,AttributeModifiers:[{AttributeName:"generic.max_health",Name:"generic.max_health",Amount:0.2,Operation:1,UUID:[I;-1600194419,796740124,-2061262516,-1732951350], Slot:"head"}]}`,
            },
          ],
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:netherite_chestplate",
          functions: [
            {
              function: "set_nbt",
              tag: `{display:{Name:'{"text":"Ahsoka Tano\\'s Chestplate","color":"gold","italic":false}'},HideFlags:255,ahsoka_chestplate:1b,AttributeModifiers:[{AttributeName:"generic.max_health",Name:"generic.max_health",Amount:0.2,Operation:1,UUID:[I;-939962238,-821476971,-1719916940,1110537383], Slot:"chest"},{AttributeName:"generic.knockback_resistance",Name:"generic.knockback_resistance",Amount:0.1,Operation:1,UUID:[I;2070244310,-771078295,-1685789333,-1480455025], Slot:"chest"}]}`,
            },
          ],
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:netherite_leggings",
          functions: [
            {
              function: "set_nbt",
              tag: `{display:{Name:'{"text":"Ahsoka Tano\\'s Leggings","color":"gold","italic":false}'},HideFlags:255,ahsoka_leggings:1b,AttributeModifiers:[{AttributeName:"generic.max_health",Name:"generic.max_health",Amount:0.1,Operation:1,UUID:[I;1865019265,-1397667338,-1820938560,-219611821], Slot:"legs"}]}`,
            },
          ],
        },
      ],
    },
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:netherite_boots",
          functions: [
            {
              function: "set_nbt",
              tag: `{display:{Name:'{"text":"Ahsoka Tano\\'s Boots","color":"gold","italic":false}'},HideFlags:255,ahsoka_boots:1b,AttributeModifiers:[{AttributeName:"generic.max_health",Name:"generic.max_health",Amount:0.1,Operation:1,UUID:[I;1773482327,37572041,-1658102902,-939607436], Slot:"feet"}]}`,
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/pushback_item`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:ender_pearl",
          functions: [
            {
              function: "set_nbt",
              tag: `{display:{Name:'{"text":"Force Push Item","italic":false}'},CustomModelData:100001,pushback_item:1}`,
            },
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 2,
                max: 6,
              },
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/jedi_holocron`, {
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:totem_of_undying",
        },
      ],
    },
  ],
});
LootTable(`loots/invisibility_item`, {
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:ender_pearl",
          functions: [
            {
              function: "set_nbt",
              tag: invisibilityItemNBT,
            },
            {
              function: "set_count",
              count: {
                type: "uniform",
                min: 2,
                max: 6,
              },
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/red_light_saber`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:carrot_on_a_stick",
          functions: [
            {
              function: "set_nbt",
              tag: `{display:{Name:'{"text":"Red Light Saber","color":"red","italic":false}',Lore:['{"text":"Right-Click to use lightning ability","color":"dark_purple","italic":false}']},HideFlags:255,CustomModelData:100001,AttributeModifiers:[{AttributeName:"generic.attack_damage",Name:"generic.attack_damage",Amount:4,Operation:0,UUID:[I;-1984893098,-440646192,-1326906271,-1844454393]}]}`,
            },
          ],
        },
      ],
    },
  ],
});
LootTable(`loots/beskar_spear`, {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:carrot_on_a_stick",
          functions: [
            {
              function: "set_nbt",
              tag: `{display:{Name:'{"text":"Beskar Spear","color":"red","italic":false}',Lore:['{"text":"Right-Click to use reach ability","color":"dark_purple","italic":false}']},HideFlags:255,CustomModelData:100002,AttributeModifiers:[{AttributeName:"generic.attack_damage",Name:"generic.attack_damage",Amount:4,Operation:0,UUID:[I;2051517231,7553137,-1362097383,-402637939]}]}`,
            },
          ],
        },
      ],
    },
  ],
});

// * BAD LOOTS
// ! Order matter as it is sampling the name from the array itself
// zombie_horde
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  time.set("midnight");
  give("@a", "minecraft:wooden_sword", 1);
  for (let i = 0; i < 10; i++) {
    summon("minecraft:zombie", rel(0, 3, 0), {
      Tags: ["lb_zombie_horde"],
    });
  }
  spreadplayers(
    rel(0, 0),
    5,
    10,
    false,
    Selector("@e", { tag: ["lb_zombie_horde"], distance: [Infinity, 20] })
  );
});
// lava
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  setblock(rel(0, 0, 0), "minecraft:lava");
});
// prison
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  execute
    .as(Selector("@a", { distance: [Infinity, 5], sort: "nearest" }))
    .at(self)
    .run(() => {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          setblock(rel(i, -1, j), "minecraft:stone");
          setblock(rel(i, 2, j), "minecraft:stone_slab");
        }
      }
      // right
      fill(rel(-1, 0, 1), rel(1, 1, 1), "minecraft:iron_bars");
      // left
      fill(rel(-1, 0, -1), rel(1, 1, -1), "minecraft:iron_bars");
      // back
      fill(rel(-1, 0, 0), rel(-1, 1, 0), "minecraft:iron_bars");
      // front
      fill(rel(1, 0, 0), rel(1, 1, 0), "minecraft:iron_bars");
    });
});
// slime
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  summon("minecraft:slime", rel(0, 0, 0), { Size: 10, Tags: ["lb_slime"] });
});
// magma
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  summon("minecraft:magma_cube", rel(0, 0, 0), {
    Size: 10,
    Tags: ["lb_magma"],
  });
});
// witch
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  summon("minecraft:witch", rel(0, 0, 0), { Tags: ["lb_witch"] });
  for (let i = 0; i < 10; i++) {
    summon("bat", rel(0, 0, 0), { Tags: ["lb_bat"] });
  }
});
// spawn_skeleton_jokey
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  summon("minecraft:skeleton_horse", rel(0, 0, 0), {
    Tags: ["lb_skeleton_horse"],
    Passengers: [
      {
        id: "minecraft:skeleton",
        Tags: ["lb_skeleton"],
        HandItems: [
          {
            id: "minecraft:bow",
            Count: NBT.byte(1),
            tag: {
              Enchantments: [{ id: "minecraft:power", lvl: NBT.short(2) }],
            },
          },
          {},
        ],
      },
    ],
  });
});
// OP zombie
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  summon("minecraft:zombie", rel(0, 0, 0), {
    Tags: ["lb_op_zombie"],
    HandItems: [
      {
        id: "minecraft:diamond_sword",
        Count: NBT.byte(1),
        tag: {
          Enchantments: [{ id: "minecraft:sharpness", lvl: NBT.short(2) }],
        },
      },
      {},
    ],
    ArmorItems: [
      {
        id: "minecraft:diamond_boots",
        Count: NBT.byte(1),
        tag: {
          Enchantments: [
            { id: "minecraft:protection", lvl: NBT.short(1) },
            { id: "minecraft:thorns", lvl: NBT.short(1) },
          ],
        },
      },
      {
        id: "minecraft:diamond_leggings",
        Count: NBT.byte(1),
        tag: {
          Enchantments: [
            { id: "minecraft:protection", lvl: NBT.short(1) },
            { id: "minecraft:thorns", lvl: NBT.short(1) },
          ],
        },
      },
      {
        id: "minecraft:diamond_chestplate",
        Count: NBT.byte(1),
        tag: {
          Enchantments: [
            { id: "minecraft:protection", lvl: NBT.short(1) },
            { id: "minecraft:thorns", lvl: NBT.short(1) },
          ],
        },
      },
      {
        id: "minecraft:diamond_helmet",
        Count: NBT.byte(1),
        tag: {
          Enchantments: [
            { id: "minecraft:protection", lvl: NBT.short(1) },
            { id: "minecraft:thorns", lvl: NBT.short(1) },
          ],
        },
      },
    ],
  });
});
// Bad Effects
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  execute
    .as(Selector("@a", { distance: [Infinity, 5] }))
    .at(self)
    .run(() => {
      effect.give(self, "minecraft:blindness", 8, 1, true);
      effect.give(self, "minecraft:slowness", 8, 3, true);
    });
});
// Look up trap
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  execute
    .as(Selector("@a", { distance: [Infinity, 5], limit: 1 }))
    .at(self)
    .run(() => {
      tellraw(self, { text: "Look Up!", color: "red" });
      setblock(rel(0, 10, 0), "minecraft:anvil");
    });
});
// illusioner_trap
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  summon("minecraft:illusioner", rel(0, 0, 0), { Tags: ["lb_illusioner"] });
});
// evoker_trap
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  for (let i = 0; i < 4; i++) {
    summon("minecraft:evoker", rel(0, 0, 0), { Tags: ["lb_evoker"] });
  }
});
// wither_trap
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  summon("minecraft:wither", rel(0, 0, 0), { Tags: ["lb_wither"] });
});
// tnt_trap
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  summon("minecraft:tnt", rel(0, 0, 0), {
    Tags: ["lb_tnt"],
    Fuse: 10,
    ignited: NBT.byte(1),
  });
});
// lightning_bolt_trap
MCFunction(`loots/${availableBadLoots[badLootsCounter++]}`, () => {
  summon("minecraft:lightning_bolt", rel(0, 0, 0));
});

// Default Loot Table
LootTable("good_loot", {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:loot_table",
          name: "default:loots/basic_tools",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/basic_armor",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/iron_armor",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/enchanted_tools",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/tame_dog",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/rare_blocks",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/bow",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/ender_pearl",
        },
        {
          type: "minecraft:loot_table",
          name: "minecraft:chests/end_city_treasure",
        },
        {
          type: "minecraft:loot_table",
          name: "minecraft:chests/bastion_treasure",
        },
        {
          type: "minecraft:loot_table",
          name: "minecraft:chests/shipwreck_treasure",
        },
        {
          type: "minecraft:loot_table",
          name: "minecraft:gameplay/fishing/treasure",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/sponge",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/enchanted_golden_apple",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/golden_apple",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/potions",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/horse",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/foods",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/ahsoka_tano_light_saber",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/ahsoka_tano_armor",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/pushback_item",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/jedi_holocron",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/invisibility_item",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/red_light_saber",
        },
        {
          type: "minecraft:loot_table",
          name: "default:loots/beskar_spear",
        },
      ],
    },
  ],
});
LootTable("bad_loot", {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 1,
      entries: [
        {
          type: "minecraft:item",
          name: "minecraft:stone",
          functions: [
            {
              function: "set_nbt",
              tag: '{"bad_loot":1b}', // It means its a bad loot
            },
          ],
        },
      ],
    },
  ],
});
const randomLoot: LootTableInstance = LootTable("random_loot", {
  type: "generic",
  pools: [
    {
      rolls: 1,
      bonus_rolls: 0,
      entries: [
        {
          type: "minecraft:loot_table",
          weight: 2,
          name: "default:good_loot",
        },
        {
          type: "minecraft:loot_table",
          weight: 1,
          name: "default:bad_loot",
        },
      ],
    },
  ],
});
