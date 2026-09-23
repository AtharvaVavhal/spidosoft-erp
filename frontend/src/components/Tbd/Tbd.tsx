import styles from './Tbd.module.css'

/** Marks UI whose data or behaviour is pending Spidosoft confirmation (docs/10). */
export function TbdTag({ reason }: { reason: string }) {
  return (
    <span className={styles.tag} title={`TBD — ${reason}`}>
      TBD<span className="sr-only">: {reason}</span>
    </span>
  )
}

/** Placeholder cell/value for data that has no confirmed source. */
export function TbdValue({ reason }: { reason: string }) {
  return (
    <span className={styles.value} title={`TBD — ${reason}`}>
      —<span className="sr-only">Pending confirmation: {reason}</span>
    </span>
  )
}
