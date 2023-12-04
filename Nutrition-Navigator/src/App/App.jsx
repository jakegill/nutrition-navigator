import { useState, useEffect } from 'react';
import { buildAdjacencyList } from '../GraphAlgos/adjacencyList';
import {bfs, meetsDietaryGoal} from '../GraphAlgos/bfs';
import { dfs } from '../GraphAlgos/dfs';
import './App.css';
import Navbar from '../Navbar/Navbar';
import Input from '../Input/Input';
import Display from '../Display/Display';
import processRecipes from '../API/api';

function App() {

  /*------- State -------*/ 
  const [ingredients, setIngredients] = useState([]); // User's ingredient input
  const [algorithm, setAlgorithm] = useState('DFS'); // Users' algo choice (bfs or dfs)
  const [goal, setGoal] = useState(''); //Users select menu choice
  const [recipes, setRecipes] = useState([]); // Used for displaying.
  const [recipeGraph, setRecipeGraph] = useState(new Map()); //Graph as AdjList
  const [bfsTime, setBfsTime] = useState(0); //Used for timing in comparison
  const [dfsTime, setDfsTime] = useState(0);

  /*------- Effects -------*/ 
  useEffect(() => { // Gets recipes from api when user changes ingredient list
    async function fetchRecipes() {
      const fetchedRecipes = await processRecipes(ingredients);
      setRecipes(fetchedRecipes);
      // console.log("============"); //log for debugging if necessary
      // console.log(JSON.stringify(fetchedRecipes)); 
      // console.log("============");
    }
  
    if (ingredients.length > 0) { 
      fetchRecipes().catch(console.error);
    }
  }, [ingredients]);

  useEffect(() => {
    if (algorithm === "DFS") {
      setRecipeGraph(buildAdjacencyList(recipes, 0.3));
    } else if (algorithm === "BFS") {
      setRecipeGraph(buildAdjacencyList(recipes, 0.3));
    }
  }, [algorithm, recipes])

  //Compare feature
  useEffect(() => {
    if (ingredients.length > 0) {
      runAlgorithmsAndMeasureTime();
    }
    // console.log(bfsTime);
    // console.log(dfsTime);
  }, [recipeGraph, goal])

  /*------- Handle changes -------*/ 
  function handleAlgorithmChange(newAlgorithm) {
    setAlgorithm(newAlgorithm);
  };

  function handleDfsOptionChange(newOption) {
    setGoal(newOption);
  };

  function handleAddIngredient(newIngredient) {
    if (!ingredients.includes(newIngredient)) {
      setIngredients(oldIngredients => [...oldIngredients, newIngredient]);
    }
  };

  function handleRemoveIngredient(index) {
    setIngredients(oldIngredients => oldIngredients.filter((_, idx) => idx !== index));
  };

  function runAlgorithmsAndMeasureTime() {
    let startNode;
    if (recipes && recipes.length > 0) {
      startNode = recipes.find(recipe => meetsDietaryGoal(recipe, goal)) || recipes[0];
    };
    const startBfs = performance.now();
    bfs(startNode, recipeGraph, goal);
    const endBfs = performance.now();
    setBfsTime(endBfs - startBfs);  
    const startDfs = performance.now();
    dfs(startNode, recipeGraph, goal);
    const endDfs = performance.now();
    setDfsTime(endDfs - startDfs);
  };

  /*----------- JSX -----------*/ 
  return (
    <>
        <Navbar></Navbar>
        <div className="main-container">
          <Input
            ingredients={ingredients} 
            onAddIngredient={handleAddIngredient} 
            onRemoveIngredient={handleRemoveIngredient} 
            onAlgorithmChange={handleAlgorithmChange}
            onDfsOptionChange={handleDfsOptionChange}
            bfsTime={bfsTime}
            dfsTime={dfsTime}
          />
          <Display 
          recipes={recipes}
          recipeGraph={recipeGraph}
          algorithm={algorithm}
          goal={goal}
          />
        </div>
    </>
  )
}

export default App