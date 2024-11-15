import styles from "./TransportAppLayout.module.css"

export function TransportAppLayout({children}){

    return(<div className={styles.container}>{children}</div>)
}