import Navbar from "../../src/navbar";
import Home from "../../src/home";
import "../App.css"

export default function page() {
  return (
    <div className="layout"> 
      <div className='-container'> <Navbar /> </div>
      <div className='-container'><Home /></div>
    </div>
  );
}