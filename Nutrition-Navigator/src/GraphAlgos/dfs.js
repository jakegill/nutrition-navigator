export function dfs(startNode, adjacencyList, dietaryGoal) {
  const visited = new Set();
  const stack = [startNode];
  const result = [];
  while (stack.length > 0) {
      const node = stack.pop();
      if (!visited.has(node)) {
          visited.add(node);
          if (meetsDietaryGoal(node, dietaryGoal)) {
              result.push(node);
          }
          const neighbors = adjacencyList.get(node) || [];
          neighbors.forEach(neighbor => {
              if (!visited.has(neighbor)) {
                  stack.push(neighbor);
              }
          });
      }
  }
  return result;
}

export function meetsDietaryGoal(node, dietaryGoal) {
  switch (dietaryGoal) {
      case 'high-protein':
          return node.proteinRatio >= 0.5;
      case 'low-carb':
          return node.carbsRatio <= 0.2;
      case 'low-fat':
          return node.fatsRatio <= 0.2;
      default:
          return false;
  }
}