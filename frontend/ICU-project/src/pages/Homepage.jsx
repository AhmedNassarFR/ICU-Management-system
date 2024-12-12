import styles from "./Homepage.module.css";
import PageNav from "../components/PageNav";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav className={styles.nav} />

      <section>
        <h1>
          you get sick
          <br />
          We take care of you
        </h1>
        <h2>
          the best ICUs in the world under the tape of your finger. don't miss
          your spot and reserve now before its too late
        </h2>
      </section>
    </main>
  );
}
