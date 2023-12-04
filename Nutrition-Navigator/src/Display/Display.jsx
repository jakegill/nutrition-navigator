import "./Display.css";
import Card from "./Card/Card";
import {bfs} from "../GraphAlgos/bfs";
import { meetsDietaryGoal, dfs } from "../GraphAlgos/dfs";

export default function Display({recipes, recipeGraph, algorithm, goal}) {

  function findStartNode(recipes, goal) {
    if (recipes && recipes.length > 0) {
      return recipes.find(recipe => meetsDietaryGoal(recipe, goal)) || recipes[0];
    }
    return null;
  }

  let displayRecipes = [];
  if (recipes && recipes.length > 0 && recipeGraph.size > 0) {
    const startNode = findStartNode(recipes, goal);
    if (algorithm === "DFS") {
      displayRecipes = dfs(startNode, recipeGraph, goal);
    }
    else if (algorithm === "BFS") {
      displayRecipes = bfs(startNode, recipeGraph, goal);
    }
  }
  
  
  return (
    <section className="display">
      <div className="display-grid">
        {displayRecipes.map(item => (
          <Card key={item.id} data={item} />
        ))}
      </div>
    </section>
  );
}