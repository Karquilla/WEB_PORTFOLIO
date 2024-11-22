import Navbar from "../../components/navbar";
import Home from "../../components/home";
import styles from "../App.module.css"

export default function page() {
  return (
    <div className={styles.layout}> 
      <div> <Navbar /> </div>
      <div className={styles.content}> <Home /> </div>
    </div>
  );
}