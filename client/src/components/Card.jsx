import PropTypes from "prop-types";
import styles from "./Card.module.css";

const Card = ({ title, action, children }) => {
  return (
    <section className={styles.card}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node,
};

export default Card;
