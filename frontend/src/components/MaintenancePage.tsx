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
    </main>
  )
}
