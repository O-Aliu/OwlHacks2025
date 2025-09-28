import { Fragment } from "react";

function ListGroup() {
  const items = ["New York ", "San Fransico", "Tokoyo", "London", "Paris"];

  items.map((item) => <li></li>);

  return (
    <>
      <h1>Practicing</h1>

      <ul className="list-group">
        <li className="list-group-item">First Scanrio</li>
        <li className="list-group-item">Second Scario</li>
        <li className="list-group-item">Third Scenario</li>
        <li className="list-group-item">Fourth Scenario</li>
        <li className="list-group-item">Fifth Scenario</li>
      </ul>
    </>
  );
}

export default ListGroup;
