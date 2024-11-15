import styles from "./ModalTransportLayout.module.css"

export function ModalTransportLayout ({children}) {
    
    return(
        <div 
        className={styles.container}>{children}</div>
    )
} 