import { MCFunction, Selector, execute, loc, raw } from "sandstone";

const self = Selector("@s");

export const pushBack = MCFunction("util/push_back", () => {
  execute
    .as(Selector("@a", { tag: ["!pushback_user"] }))
    .at(self)
    .run(() => {
      // delta api stuff
      raw(`scoreboard players set $strength delta.api.launch 100000`);
      execute
        .facingEntity(
          Selector("@a", {
            tag: ["pushback_user"],
            limit: 1,
            sort: "nearest",
          }),
          "feet"
        )
        .facing(loc(0, 0, -1))
        .run.functionCmd("delta:api/launch_looking");
    });
});
