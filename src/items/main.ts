import {
  execute,
  tag,
  Selector,
  _,
  kill,
  tellraw,
  effect,
  give,
  PredicateInstance,
  Predicate,
  say,
} from "sandstone";
import { playerUsedEnderPearl } from "../main";
import { pushBack } from "../util/pushBack";

const self = Selector("@s");

/* detect if the player is using the custom ender pearl item */
export const enderPearlItemsLogic = () => {
  execute
    .as("@a")
    .at(self)
    .if(playerUsedEnderPearl.matches([1, Infinity]))
    .run(() => {
      playerUsedEnderPearl.reset();

      // Push back item
      tagChecking("Item.tag.pushback_item", pushBackItemLogic);

      // Invisibility Item Logic
      tagChecking("Item.tag.invisibility_item", invisibilityItemLogic);
    });
};
/* Tag Checking: that is if the enderpearl has the specified tag */
const tagChecking = (tagName: string, cb) => {
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
