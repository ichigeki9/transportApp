import { ModalTransportLayout } from "../ModalTransportLayout/ModalTransportLayout";
import styles from './ErrorBlock.module.css'

export function ErrorBlock(props) {
    return(
        <ModalTransportLayout>
            <div className={styles.errorBlock}>
                <h3>Błąd </h3>
                <p>{props.message}</p>
            </div>
        </ModalTransportLayout>
    )
}