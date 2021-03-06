import React from 'react';
import Modal from 'react-bootstrap/Modal';
import CropperImg from './cropper/cropper';
import 'bootstrap/dist/css/bootstrap.min.css';

const ModalCrop = ({
  showModal,
  setShowModal,
  imageToSave,
  croppedImage,
  setCroppedImage,
  upload,
  finalImage,
  sendCroppedImageServer,
}) => {
  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCroppedImage(null);
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Crop your image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CropperImg
            imageToSave={imageToSave}
            croppedImage={croppedImage}
            setCroppedImage={setCroppedImage}
            upload={upload}
            finalImage={finalImage}
            sendCroppedImageServer={sendCroppedImageServer}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalCrop;
