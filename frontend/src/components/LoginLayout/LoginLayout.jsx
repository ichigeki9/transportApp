import styles from "./loginLayout.module.css"


export function LoginLayout({children}){
    return(
        <div className={styles.container}>{children}</div>
    )
}