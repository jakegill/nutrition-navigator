import "./Input.css";
import Modal from "./Modal/Modal";
import { useState, useEffect } from "react";

export default function Input({ ingredients, onAddIngredient, onRemoveIngredient, onAlgorithmChange, onDfsOptionChange, bfsTime, dfsTime }) {

  const [isBFS, setAlgorithm] = useState(false); //Radio buttons
  const [goalSelected, setGoalSelected] = useState(""); //Nutrition goal select choice
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    onAlgorithmChange(isBFS ? 'BFS' : 'DFS');
  }, [isBFS, onAlgorithmChange]);

  useEffect(() => {
    onDfsOptionChange(goalSelected);
  }, [goalSelected, onDfsOptionChange]);

  function handleRadioClick(event) {
    const selectedValue = event.target.value;
    if (selectedValue === 'BFS') {
        setAlgorithm(true);
    } else {
        setAlgorithm(false);
    } 
  }

  function handleCompareClick(event) {
    setOpenModal(true);
  }

  function handleCloseModalClick(event) {
    setOpenModal(false);
  }

  function handleSelectChange(event) {
    const selectedValue = event.target.value;
    setGoalSelected(selectedValue);
  }

  function handleTextboxClick(event) {
    const inputElement = event.target.form.elements['food-search'];
    inputElement.placeholder = '';
  }

  function handleInputClick(event) {
    event.preventDefault();

    const inputElement = event.target.form.elements['food-search'];
    const newIngredient = inputElement.value.trim().toLowerCase();
    
    if (newIngredient === '') {
      inputElement.placeholder = "Enter a valid ingredient.";
    } else if (ingredients.includes(newIngredient)) {
      inputElement.placeholder = "Cannot enter duplicates.";
      event.target.form.elements['food-search'].value = '';
    } else {
      onAddIngredient(newIngredient);
      event.target.form.elements['food-search'].value = '';
      inputElement.placeholder = "";
    }
  }

  return (
  <section className="input">
    <h2 className="input-title">Discover healthy recipes!</h2>

    <form className="input-algo">
      <label htmlFor="dfs">
        <input type="radio" id="dfs" name="algo" value="DFS" onClick={handleRadioClick}/>
        DFS
      </label>
      <label htmlFor="bfs">
        <input type="radio" id="bfs" name="algo" value="BFS" onClick={handleRadioClick}/>
        BFS
      </label>
      <button type="button" className="input-button" onClick={handleCompareClick}>Compare</button>
    </form>

    <form className="input-dfs">
      <label htmlFor="dfs-option">Nutrition Goal:</label>
        <select className="input-select" onChange={handleSelectChange}>
          <option value="high-protein">High Protein</option>
          <option value="low-carb">Low Carb</option>
          <option value="low-fat">Low Fat</option>
        </select>
    </form>
    
    <form className="input-form">
      <label className="input-label-search" htmlFor="food-search">
        Ingredient:  
        <input className="input-textbox" onClick={event => handleTextboxClick(event)} type="text" name="food-search"/>
      </label>
      <button className="input-button" onClick={(event) => {handleInputClick(event)}}>Add</button>
    </form>
    
    <ul className="input-ingredient-list">
        {ingredients.map((ingredient, index) => (
          <li className="input-ingredient" key={index}>
            {ingredient}
            <button onClick={() => {onRemoveIngredient(index)}} className="list-remove">Remove {/* SVG here */}</button>
          </li>
        ))}
    </ul>

    {openModal && <Modal onClose={handleCloseModalClick} bfsTime={bfsTime} dfsTime={dfsTime}/>}
  
  </section>
  );
}