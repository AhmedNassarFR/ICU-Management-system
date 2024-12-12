import { NavLink, Link } from "react-router-dom";
import styles from "./PageNav.module.css";
import "../index.css";
import Logo from "./Logo";
function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/Register" className={styles.ctaLink}>
            Register
          </NavLink>
          <Link to="/Login" className={styles.ctaLink}>
            Get YOur ICU
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
