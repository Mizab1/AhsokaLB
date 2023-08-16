import type { SandstoneConfig } from "sandstone";

export default {
  name: "AhsokaLB",
  description: ["A Datapack Created By: ", { text: "Mizab", color: "gold" }],
  formatVersion: 15,
  namespace: "default",
  packUid: "3NnwQEM1",
  // saveOptions: { path: "./.sandstone/output/datapack" },
  saveOptions: { world: "Testing 4" },
  onConflict: {
    default: "warn",
  },
} as SandstoneConfig;
