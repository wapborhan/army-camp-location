"use client";

import { useEffect, useState } from "react";
import ArmyMap from "./ArmyMap";

export default function Home() {
  const [allCamps, setAllCamps] = useState([]);

  useEffect(() => {
    fetch("armyCampData.json")
      .then((res) => res.json())
      .then((data) => setAllCamps(data));
  }, []);

  return (
    <div>
      <main className="flexs flex-cols md:flex-rows">
        <ArmyMap allCamps={allCamps} />
      </main>
    </div>
  );
}
