import { AddTransportForm } from "../AddTransportForm/AddTransportForm";
import { ModalTransportLayout } from "../ModalTransportLayout/ModalTransportLayout";

export function ModalAddTransport(props) {


	return (
		<ModalTransportLayout>
			<AddTransportForm
				transportDataList={props.transportDataList}
				OnClick={props.OnClick}
				setTransportDataList={props.setTransportDataList}
				currentDate={props.currentDate}
				
			/>
			
		</ModalTransportLayout>
	);
}
