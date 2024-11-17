import Navbar from "../../src/navbar";
import Astar from "../../src/aStar";
import "../App.css"

export default function page() {
  return (
    <div>
      
    <div className="layout">
      <div className='-container'> <Navbar /> </div>
        <div className="grid-container"> <Astar /> </div>
    </div>
    </div>
  );
}