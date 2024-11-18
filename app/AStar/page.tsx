import Navbar from "../../components/navbar";
import Astar from "../../components/aStar";
import styles from "../App.module.css"

// grid_container need an outer and inner so backgroubn

export default function page() {
  return (
    <div>
      
    <div className={styles.layout}>
      <div className={styles.container}> <Navbar /> </div>
      <div style={{
              display: 'flex',
              padding: '0%',
              backgroundColor: '#555555',
              width: '100vw',
              height: '100vw'}} >
        <div className={styles.grid_container}> 
          <Astar /> 
          </div>
        </div>
    </div>
    </div>
  );
}