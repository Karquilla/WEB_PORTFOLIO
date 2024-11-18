import Navbar from "../../components/navbar";
import Astar from "../../components/aStar";
import styles from "../App.module.css"

export default function page() {
  return (
    <div>
      
    <div className={styles.layout}>
      <div className={styles.container}> <Navbar /> </div>
        <div className={styles.grid_container}> <Astar /> </div>
    </div>
    </div>
  );
}