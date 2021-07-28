import React from 'react'
import Modal from 'react-modal'

import './ErrorModal.css';

Modal.setAppElement('#root')
function ErrorModal(Probs) {
    return (
        <div className='errormodal-maincontainer'>
            <Modal style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)'
                },
                content: {
                    top: '250px',
                    left: '350px',
                    right: '350px',
                    bottom: '250px',
                    background: '#fff',
                }
            }} isOpen={Probs.visible} onRequestClose={Probs.ModalHandler}>
                <div className='errormodal-content'>
                    <h1>{Probs.title}</h1>
                    <h3>{Probs.content}</h3>
                    <button onClick={Probs.ModalHandler} >Close</button>
                </div>
            </Modal>
        </div>
    )
}

export default ErrorModal;
