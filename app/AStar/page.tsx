import Navbar from "../../components/navbar";
import Astar from "../../components/aStar";
import styles from "../App.module.css"

// grid_container need an outer and inner so backgroubn

export default function page() {
  return (
    <div>
      
    <div className={styles.layout}>
      <div > <Navbar /> </div>
      <div style={{ //background
            display: 'flex',
            padding: '0%',
            backgroundColor: '#333333',
            width: '100vw',
            height: '100vw'}} >
          <div className={styles.content}> <Astar /> </div>
      </div>
    </div>
    </div>
  );
}