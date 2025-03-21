"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState<number>(0);
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]; // サンプルアイテム

  const { scrollY } = useScroll();

  const [containerInfo, setContainerInfo] = useState({
    top: 0,
    height: 0,
    scrollDistance: 0,
  });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const scrollDistance = (items.length - 1) * window.innerHeight;

      setContainerInfo({
        top,
        height: rect.height,
        scrollDistance,
      });

      setItemWidth(100 / items.length);
    }
  }, [items.length]);

  // xの位置をスクロール位置から計算
  const x = useTransform(
    scrollY,
    [containerInfo.top, containerInfo.top + containerInfo.scrollDistance],
    [0, -((items.length - 1) * 100)],
    { clamp: true },
  );

  return (
    <div
      style={{
        height: `${containerInfo.scrollDistance + window.innerHeight}px`,
      }}
    >
      <motion.div
        ref={containerRef}
        className="sticky-container"
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <motion.div
          className="container"
          style={{
            display: "flex",
            width: `${items.length * 100}%`,
            height: "100%",
            x,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="js-item"
              style={{
                width: `${itemWidth}%`,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#e0e0e0",
              }}
            >
              {item}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
