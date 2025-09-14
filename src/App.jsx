import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ฟังก์ชันเช็คว่าเส้นสองเส้นตัดกันหรือไม่
function lineIntersect(p1, p2, p3, p4) {
  const ccw = (A, B, C) =>
    (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  return (
    ccw(p1, p3, p4) !== ccw(p2, p3, p4) &&
    ccw(p1, p2, p3) !== ccw(p1, p2, p4)
  );
}

// สร้างกราฟ โดย normalize พิกัด 0-1
function generateGraph(numNodes = 6, level = "Medium") {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i + 1,
    x: Math.random(),
    y: Math.random(),
  }));

  const edges = [];
  const degree = Array(numNodes).fill(0);
  let targetEdges = numNodes;
  if (level === "Medium") targetEdges = numNodes + Math.floor(numNodes / 2);
  if (level === "Hard") targetEdges = Math.floor(numNodes * 1.5);

  for (let i = 0; i < numNodes; i++) {
    while (degree[i] < 2) {
      const j = Math.floor(Math.random() * numNodes);
      if (
        i !== j &&
        !edges.find(
          (e) =>
            (e.from === i + 1 && e.to === j + 1) ||
            (e.from === j + 1 && e.to === i + 1)
        )
      ) {
        edges.push({ from: i + 1, to: j + 1 });
        degree[i]++;
        degree[j]++;
      }
    }
  }

  while (edges.length < targetEdges) {
    const a = Math.ceil(Math.random() * numNodes);
    const b = Math.ceil(Math.random() * numNodes);
    if (
      a !== b &&
      !edges.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a))
    ) {
      edges.push({ from: a, to: b });
      degree[a - 1]++;
      degree[b - 1]++;
    }
  }

  return { nodes, edges };
}

export default function App() {
  const [numNodes, setNumNodes] = useState(6);
  const [level, setLevel] = useState("Medium");
  const [graph, setGraph] = useState(generateGraph(6, "Medium"));
  const [dragging, setDragging] = useState(null);

  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const [bestTimes, setBestTimes] = useState(() => {
    const data = localStorage.getItem("planarityBestTimes");
    return data ? JSON.parse(data) : {};
  });

  const svgRef = useRef(null);
  const { nodes, edges } = graph;

  const hasAnyIntersection = (nodes, edges) => {
    for (let i = 0; i < edges.length; i++) {
      for (let j = i + 1; j < edges.length; j++) {
        const e1 = edges[i];
        const e2 = edges[j];
        if (
          e1.from !== e2.from &&
          e1.from !== e2.to &&
          e1.to !== e2.from &&
          e1.to !== e2.to
        ) {
          const p1 = nodes.find((n) => n.id === e1.from);
          const p2 = nodes.find((n) => n.id === e1.to);
          const p3 = nodes.find((n) => n.id === e2.from);
          const p4 = nodes.find((n) => n.id === e2.to);
          const map = (n) => ({ x: n.x * 1000, y: n.y * 1000 });
          if (lineIntersect(map(p1), map(p2), map(p3), map(p4))) return true;
        }
      }
    }
    return false;
  };

  const hasIntersections = () => hasAnyIntersection(nodes, edges);

  const handleMouseDown = (id) => (e) => {
    setDragging(id);
    if (!running) {
      setRunning(true);
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
  };

  const handleMouseMove = (e) => {
    if (dragging !== null && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setGraph((graph) => ({
        ...graph,
        nodes: graph.nodes.map((n) =>
          n.id === dragging
            ? {
                ...n,
                x: Math.min(Math.max(x, 0), 1),
                y: Math.min(Math.max(y, 0), 1),
              }
            : n
        ),
      }));
    }
  };

  const handleMouseUp = () => setDragging(null);

  const newGame = () => {
    let newGraph;
    let attempts = 0;
    do {
      newGraph = generateGraph(numNodes, level);
      attempts++;
      if (attempts > 100) break;
    } while (!hasAnyIntersection(newGraph.nodes, newGraph.edges));
    setGraph(newGraph);
    setTime(0);
    setRunning(false);
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!hasIntersections() && running) {
      clearInterval(timerRef.current);
      setRunning(false);

      const key = `${numNodes}-${level}`;
      const prevBest = bestTimes[key] || Infinity;
      if (time < prevBest) {
        const newBestTimes = { ...bestTimes, [key]: time };
        setBestTimes(newBestTimes);
        localStorage.setItem("planarityBestTimes", JSON.stringify(newBestTimes));
      }
    }
  }, [nodes]);

  const getEdgeColor = () => {
    if (hasIntersections()) {
      const t = Date.now() % 1000;
      const intensity = Math.floor(150 + 105 * Math.sin((t / 1000) * 2 * Math.PI));
      return `rgb(${intensity},0,0)`;
    }
    return "green";
  };

  return (
    <div className="app-container">
      <h1>🕹️ Planarity Puzzle 🕹️</h1>
      <div className="main-container">
        {/* SVG Graph */}
        <div className="svg-container">
          <svg
            ref={svgRef}
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid meet"
            width="100%"
            height="100%"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {edges.map((e, i) => {
              const p1 = nodes.find((n) => n.id === e.from);
              const p2 = nodes.find((n) => n.id === e.to);
              const isWin = !hasIntersections();
              return (
                <line
                  key={i}
                  className={isWin ? "edge-glow" : "edge-line"}
                  x1={p1.x * 1000}
                  y1={p1.y * 1000}
                  x2={p2.x * 1000}
                  y2={p2.y * 1000}
                  stroke={isWin ? "#2ecc71" : getEdgeColor()}
                  strokeWidth={5}
                />
              );
            })}
            {nodes.map((n) => (
              <g key={n.id}>
                <circle
                  className="node-circle"
                  cx={n.x * 1000}
                  cy={n.y * 1000}
                  r={20}
                  fill="#1abc9c"
                  stroke="#45786dff"
                  strokeWidth={3}
                  onMouseDown={handleMouseDown(n.id)}
                />

              </g>
            ))}
          </svg>
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <div className="input-group">
            <label>Level: </label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="input-group">
            <label>จำนวนจุด: </label>
            <input
              type="number"
              min="6"
              max="20"
              value={numNodes}
              onChange={(e) =>
                setNumNodes(Math.min(Math.max(parseInt(e.target.value) || 6, 3), 20))
              }
            />
          </div>

          <button className="btn" onClick={newGame}>
            🔄 New Graph
          </button>

          <div>⏱️ เวลา: <b>{time}</b> วินาที</div>
          <div>🏆 Best: <b>{bestTimes[`${numNodes}-${level}`] || "-"}</b> วินาที</div>

          {!hasIntersections() && <div className="win-text">🎉 คุณชนะแล้ว!</div>}
        </div>
      </div>
    </div>
  );
}
