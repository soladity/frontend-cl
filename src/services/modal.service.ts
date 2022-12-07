import { updateModalState } from "../reducers/modal.reducer";
import { AppDispatch } from "../store";

const handleEarlyAccessModalOpen = (dispatch: AppDispatch, open: boolean) => {
  dispatch(updateModalState({ earlyAccessModalOpen: open }));
};

const ModalService = {
  handleEarlyAccessModalOpen,
};

export default ModalService;
