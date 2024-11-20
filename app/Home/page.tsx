import Navbar from "../../components/navbar";
import Home from "../../components/home";
import styles from "../App.module.css"

export default function page() {
  return (
    <div className={styles.layout}> 
      <div className={styles.container}> <Navbar /> </div>
      <div style={{ //background
          display: 'flex',
          padding: '0%',
          backgroundColor: '#222222',
          width: '100vw',
          height: '100vw'}} > 
        <div className={styles.content_container}> <Home /></div>
      </div>
    </div>
  );
}