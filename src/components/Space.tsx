import React from "react";
import { Space as SpaceType } from "../types";

export const Space: React.FC<{
  space: SpaceType;
  cloak: boolean;
  light: boolean | undefined;
}> = React.memo(({ space, cloak, light }) => {
  const { player, darkness } = space;
  const glowInTheDark = !darkness || true;
  const iconClasses: Record<string, string> = {
    wand: "scroll wand",
    potion: "flask potion",
    boss: "skull boss",
    door: "lock door",
    book: "book book",
    wall: "wall",
  };

  const iconClass = player ? iconClasses[player] || "hat-wizard " + player : "";

  const dark = darkness ? "darkness" : player || "light";

  const cloaked = !light && cloak ? "bg-blue-400" : "bg-gray-800";

  return (
    <div className={`space ${cloaked} ${dark}`}>
      <i className={glowInTheDark ? `fas fa-${iconClass}` : ""} />
    </div>
  );
});
