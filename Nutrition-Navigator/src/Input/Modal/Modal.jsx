import "./Modal.css";

export default function Modal({ onClose, bfsTime, dfsTime }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>DFS time: {dfsTime} ms</p>
        <p>BFS time: {bfsTime} ms</p>
        <button className="modal-close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};


