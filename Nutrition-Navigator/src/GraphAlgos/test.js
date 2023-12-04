import json from "./test-data.json";
import { buildAdjacencyList } from "./adjacencyList";
import bfs from "./bfs";
import { dfs } from "./dfs";

export default function test() {
  let adjacencyList = new Map();
  adjacencyList = buildAdjacencyList(json);
  console.log(bfs(jsonData[0], adjacencyList));
}

