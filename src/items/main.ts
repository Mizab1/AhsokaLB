import {
  MCFunction,
  Predicate,
  PredicateInstance,
  Selector,
  _,
  effect,
  execute,
  give,
  kill,
  particle,
  raw,
  rel,
  tag,
  tellraw,
} from "sandstone";
import { raycast } from "sandstone-raycast";
import {
  playerUsedCarrotOnAStick,
  playerUsedEnderPearl,
  redLightSaberCooldownPlayer,
} from "../main";
import { pushBack } from "../util/pushBack";

const self = Selector("@s");

// ** Ender Pearl Based **//
/* detect if the player is using the custom ender pearl item */
export const enderPearlItemsLogic = () => {
  execute
    .as("@a")
    .at(self)
    .if(playerUsedEnderPearl.matches([1, Infinity]))
    .run(() => {
      playerUsedEnderPearl.reset();

      // Push back item
      tagCheckingForEnderPearl("Item.tag.pushback_item", pushBackItemLogic);

      // Invisibility Item Logic
      tagCheckingForEnderPearl(
        "Item.tag.invisibility_item",
        invisibilityItemLogic
      );
    });
};
/* Tag Checking: that is if the enderpearl has the specified tag */
const tagCheckingForEnderPearl = (tagName: string, cb: { (): void }) => {
  _.if(
    _.data.entity(
      Selector("@e", {
        type: "minecraft:ender_pearl",
        distance: [Infinity, 1.6],
        limit: 1,
        sort: "nearest",
      }),
      tagName
    ),
    () => {
      cb();
    }
  );
};

/* Pushback Item */
const pushBackItemLogic = () => {
  tag(self).add("pushback_user");
  execute
    .as(Selector("@e", { type: "minecraft:ender_pearl" }))
    .if(_.data.entity("@s", "Item.tag.pushback_item"))
    .run(() => {
      pushBack();
      kill(self);
    });
  tag(self).remove("pushback_user");
};

/* Invisibility Item */
export const invisibilityItemNBT: string = `{display:{Name:'{"text":"Force Stealth Item","color":"gold","italic":false}'},CustomModelData:100002, invisibility_item:1b}`;
const invisibilityItemLogic = () => {
  // check if the player in invisible and has the invisibility tag
  _.if(Selector("@s", { predicate: `!${isInvisiblePredicate}` }), () => {
    tellraw(self, {
      text: "You are now Invisible, remember to remove any armor you have and don't hold any weapon!",
      color: "gold",
    });
    effect.give(self, "minecraft:invisibility", 15, 0, true);
  }).else(() => {
    tellraw(self, {
      text: "You are already invisible, You cannot use this item again",
      color: "red",
    });
    give(self, "minecraft:ender_pearl" + invisibilityItemNBT, 1);
  });

  // kill the ender pearl
  execute
    .as(Selector("@e", { type: "minecraft:ender_pearl" }))
    .if(_.data.entity("@s", "Item.tag.invisibility_item"))
    .run(() => {
      kill(self);
    });
};
const isInvisiblePredicate: PredicateInstance = Predicate(
  "is_invisible_predicate",
  {
    condition: "minecraft:entity_properties",
    entity: "this",
    predicate: {
      type: "minecraft:player",
      // @ts-ignore
      effects: {
        "minecraft:invisibility": {},
      },
    },
  }
);

//** COAS Based *//
/* detect if the player is using the coas item */
export const carrotOnAStickItemsLogic = () => {
  // Always highlight the target when player is holding the item
  execute
    .as("@a")
    .at(self)
    .run(() => {
      itemCheckingForCOAS(
        "red_lightsaber",
        100001,
        redLightSaberHighlightTarget
      );

      // Red light Saber Cooldown Logic
      redLightSaberCooldownLogic();
    });
  // Detect when the player When used the item
  execute
    .as("@a")
    .at(self)
    .if(playerUsedCarrotOnAStick.matches([1, Infinity]))
    .run(() => {
      playerUsedCarrotOnAStick.reset();

      // if the player used the custom item item
      itemCheckingForCOAS("red_lightsaber", 100001, redLightSaberLogic);
      itemCheckingForCOAS("beskar_spear", 100002, beskarSpearLogic);
    });
};
// Create the predicate and test if the player is folding the custom item
// ! This function must be run from the context of the player
const itemCheckingForCOAS = (
  predicateName: string,
  customModelData: number,
  cb: { (): void }
) => {
  // Create a  custom predicate
  const predicate = Predicate(
    predicateName,
    {
      condition: "minecraft:entity_properties",
      entity: "this",
      predicate: {
        type: "minecraft:player",
        equipment: {
          mainhand: {
            items: ["minecraft:carrot_on_a_stick"],
            nbt: `{CustomModelData:${customModelData}}`,
          },
        },
      },
    },
    {
      onConflict: "ignore",
    }
  );

  // check if the player is using the custom item from which the predicate was created
  _.if(Selector("@s", { predicate: predicate }), () => {
    cb();
  });
};

const redLightSaberLogic = () => {
  _.if(redLightSaberCooldownPlayer.matches(0), () => {
    tag(self).add("used_red_lightsaber");
    execute.anchored("eyes").run(() => {
      raycast(
        "raycast/red_saber_lightning/lightning/main",
        // @ts-ignore
        "#aestd1:passthrough",
        Selector("@e", {
          type: "#aestd1:living_base",
          tag: "!used_red_lightsaber",
          dx: 0,
        }),
        MCFunction("raycast/red_saber_lightning/lightning/update", () => {
          raw(`particle minecraft:electric_spark ~ ~ ~ 0 0 0 0.1 1`);
        }),
        MCFunction("raycast/red_saber_lightning/lightning/hit", () => {
          execute
            .at(
              Selector("@e", {
                type: "#aestd1:living_base",
                tag: "!used_red_lightsaber",
                dx: 0,
              })
            )
            .run.summon("minecraft:lightning_bolt", rel(0, 0, 0));
        })
      );
    });
    tag(self).remove("used_red_lightsaber");
    // Add a cooldown
    redLightSaberCooldownPlayer.set(40);
  });
};
const redLightSaberHighlightTarget = () => {
  tag(self).add("is_holding_red_lightsaber");
  execute.anchored("eyes").run(() => {
    raycast(
      "raycast/red_saber_lightning/highlight/main",
      // @ts-ignore
      "#aestd1:passthrough",
      Selector("@e", {
        type: "#aestd1:living_base",
        tag: "!is_holding_red_lightsaber",
        dx: 0,
      }),
      MCFunction("raycast/red_saber_lightning/highlight/update", () => {}),
      MCFunction("raycast/red_saber_lightning/highlight/hit", () => {
        execute
          .as(
            Selector("@e", {
              type: "#aestd1:living_base",
              tag: "!is_holding_red_lightsaber",
              dx: 0,
            })
          )
          .run.effect.give(self, "minecraft:glowing", 1, 0, true);
      })
    );
  });
  tag(self).remove("is_holding_red_lightsaber");
};
const redLightSaberCooldownLogic = () => {
  _.if(_.not(redLightSaberCooldownPlayer.matches([Infinity, 0])), () => {
    redLightSaberCooldownPlayer.remove(1);
  }).else(() => {
    redLightSaberCooldownPlayer.set(0);
  });
};

const beskarSpearLogic = () => {
  execute
    .as(Selector("@e", { type: "#aestd1:living_base", distance: [1, 8] }))
    .at(self)
    .run(() => {
      raw(`damage @s 3 minecraft:generic`);
      particle(
        "minecraft:enchanted_hit",
        rel(0, 1, 0),
        [0.5, 0.5, 0.5],
        0.1,
        30
      );
    });
};
