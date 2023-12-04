import "./Card.css";

export default function Card({data}) {
  return (
    <article className="card-container">
      <div className="card-image" style={{ backgroundImage: `url(${data.image})` }}></div>
      <h3 className="card-recipe-title">{data?.name}</h3>
      <ul className="card-recipe-stats">
        <li className="card-li">Protein: {data?.protein}</li>
        <li className="card-li">Carbs: {data?.carbs}</li>
        <li className="card-li">Fats: {data?.fats}</li>
      </ul>
    </article>
  );
}