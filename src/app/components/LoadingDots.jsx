// components/LoadingDots.js
import styles from '../../styles_css/LoadingDots.css'

const LoadingDots = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default LoadingDots;
