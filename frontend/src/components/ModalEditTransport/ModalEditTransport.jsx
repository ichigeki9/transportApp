import { EditTransformFrom } from "../EditTransformFrom/EditTransformFrom"
import { ModalTransportLayout } from "../ModalTransportLayout/ModalTransportLayout"

export function ModalEditTransport(props) {
    return (
        <ModalTransportLayout >
            <EditTransformFrom transportDataList={props.transportDataList}  OnClick={props.OnClick} setTransportDataList={props.setTransportDataList}currentDate={props.currentDate} />
        </ModalTransportLayout>
    )
}