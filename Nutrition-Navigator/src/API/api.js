async function findRecipesByIngredients(ingredients, numberOfRecipes=10) {
  const ingredientsCSV = ingredients.join(',');
  const apiKey = import.meta.env.VITE_SPOON_KEY;
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsCSV)}&number=${numberOfRecipes}&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getRecipesNodes(ingredients) {
  const recipes = await findRecipesByIngredients(ingredients, 50);
  return recipes.map(recipe => ({
    id: recipe.id,
    name: recipe.title,
    image: recipe.image,
    protein: null,
    carbs: null,
    fats: null,
    calories: null
  }));
}

async function getRecipeInformation(recipeId) {
  const apiKey = import.meta.env.VITE_SPOON_KEY;
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}&includeNutrition=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

//Had to implement batch and delay because API only allows 5req/second otherwise 429 error
async function fetchAndUpdateNutrition(nodes, batchSize = 5, delay = 1000) {
  const updatedNodes = [];

  for (let i = 0; i < nodes.length; i += batchSize) {
      const batch = nodes.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(node => getRecipeInformation(node.id)));

      batchResults.forEach((nutritionData, index) => {
          if (nutritionData && nutritionData.nutrition) {
              const nutrients = nutritionData.nutrition.nutrients;
              const node = batch[index];
              node.protein = nutrients.find(n => n.name === "Protein")?.amount || 0;
              node.carbs = nutrients.find(n => n.name === "Carbohydrates")?.amount || 0;
              node.fats = nutrients.find(n => n.name === "Fat")?.amount || 0;
              node.calories = nutrients.find(n => n.name === "Calories")?.amount || 0;

              const totalMacros = node.protein + node.carbs + node.fats;
              node.proteinRatio = totalMacros > 0 ? node.protein / totalMacros : 0; 
              node.carbsRatio = totalMacros > 0 ? node.carbs / totalMacros : 0;
              node.fatsRatio = totalMacros > 0 ? node.fats / totalMacros : 0;
              updatedNodes.push(node);
          }
      });
      if (i + batchSize < nodes.length) {
          await new Promise(resolve => setTimeout(resolve, delay));
      }
  }
  return updatedNodes;
}

export default async function processRecipes(ingredients) {
  const nodes = await getRecipesNodes(ingredients);
  const nodesWithNutrition = await fetchAndUpdateNutrition(nodes);
  return nodesWithNutrition;
}
