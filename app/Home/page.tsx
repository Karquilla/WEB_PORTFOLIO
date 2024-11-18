import Navbar from "../../components/navbar";
import Home from "../../components/home";
import styles from "../App.module.css"

export default function page() {
  return (
    <div className={styles.layout}> 
      <div className={styles.container}> <Navbar /> </div>
      <div className={styles.container}><Home /></div>
    </div>
  );
}