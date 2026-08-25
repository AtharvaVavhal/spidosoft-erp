import styles from './MaintenancePage.module.css'

export function MaintenancePage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.markWrap}>
          <span className={styles.ring} aria-hidden="true" />
          <span className={styles.ringMask} aria-hidden="true" />
          <img src="/favicon.svg" alt="" className={styles.mark} width={48} height={46} />
        </div>

        <h1 className={styles.headline}>Be right back.</h1>
        <p className={styles.supporting}>
          We&rsquo;re making a few updates to SpidoSoft. Thanks for your patience &mdash; check back
          shortly.
        </p>
      </div>

      <a
        href="https://forgebuilds.in"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.credit}
      >
        <svg
          viewBox="0 0 120 120"
          width="13"
          height="13"
          className={styles.creditMark}
          aria-hidden="true"
        >
          <path d="M 0,0 L 120,0 L 90,30 L 30,30 L 30,50 L 80,50 L 60,70 L 30,70 L 30,100 L 0,70 Z" fill="currentColor" />
          <path d="M 0,90 L 30,120 L 0,120 Z" fill="currentColor" />
        </svg>
        Developed &amp; managed by Forge Technologies
      </a>
    </main>
  )
}
