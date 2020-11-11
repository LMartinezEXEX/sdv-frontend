import React, { useState } from 'react'
import Modal from '../../Modal'
import JoinForm from './JoinForm'

const JoinGame= () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div >
            <button className= "app-btn small-btn-group" onClick={() => setIsOpen(true)}> Unirse a Partida </button>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <JoinForm />
            </Modal>
        </div>
    )
}

export default JoinGame;