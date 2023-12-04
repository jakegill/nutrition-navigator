export function bfs(start, adjacencyList, dietaryGoal) {
    const visited = new Set();
    const queue = [];
    const recipesToBeDisplayed = [];
    queue.push(start);
    while (queue.length > 0) {
        const node = queue.shift();
        if (!visited.has(node) && meetsDietaryGoal(node, dietaryGoal)) {
            visited.add(node);
            recipesToBeDisplayed.push(node);
            const similarRecipes = adjacencyList.get(node) || []; //neighboring nodes
            similarRecipes.forEach(neighbor => {
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                }
            });
        }
    }
    return recipesToBeDisplayed;
}

export function meetsDietaryGoal(node, dietaryGoal) {
    switch (dietaryGoal) {
        case 'high-protein':
            return node.proteinRatio >= 0.45;
        case 'low-carb':
            return node.carbsRatio <= 0.25;
        case 'low-fat':
            return node.fatsRatio <= 0.25;
        default:
            return false;
    }
}

