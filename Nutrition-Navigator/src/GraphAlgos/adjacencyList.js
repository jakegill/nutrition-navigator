
//Edges based on similarity between the recipe's ratios of protein-carbs-fats
//So if a user wants a low carb diet... this filter will be able to detect all recipes low carb out of the dataset. ect.

export function buildAdjacencyList(recipes, sim) { // 0 < sim < 1
  const adjacencyList = new Map();
  const similarity = sim; //The % difference between recipes macros

  recipes.forEach((recipe, index) => {
    adjacencyList.set(recipe, []);
    for (let i = 0; i < recipes.length; i++) {
      if (i !== index) {
        const distance = calculateNutritionalDistance(recipe, recipes[i]);
        if (distance < similarity) {
          adjacencyList.get(recipe).push(recipes[i]);
        }
      }
    }
  });
  return adjacencyList;
}

function calculateNutritionalDistance(recipe1, recipe2) {
  //We use the distance formula with the ratios for edge weights.
  const proteinDistance = Math.pow(recipe1.proteinRatio - recipe2.proteinRatio, 2);
  const carbsDistance = Math.pow(recipe1.carbsRatio - recipe2.carbsRatio, 2);
  const fatsDistance = Math.pow(recipe1.fatsRatio - recipe2.fatsRatio, 2);
  return Math.sqrt(proteinDistance + carbsDistance + fatsDistance);
}
