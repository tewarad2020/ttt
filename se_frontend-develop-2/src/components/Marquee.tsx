import React from "react";

export default function Marquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-gray-100">
      <div className="inline-block animate-marquee">
        📢 Welcome to SkillBridge!
      </div>
    </div>
  );
}
