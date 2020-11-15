import React from 'react'
import axios from 'axios'
import '../../assets/css/game.css'
import MortifagoBoard from './mortifagoBoard';
import OrderBoard from './orderBoard';
import Envelope from './Envelope'
import PopUp from './PopUp'
import { updateGameState, enableSpell, getPlayersInfo, getDirectorCandidates, getCandidates, openTableCurrentTurn } from "../../redux/actions";
import { connect } from 'react-redux';
import useInterval from '../../useInterval'
import Drawer from '@material-ui/core/Drawer';
import SpellsList from './SpellsList'
import Modal from '../Modal'
import { useState } from 'react'

const Game = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const { gameId, actualMinister, actualDirector, candidateMinister, candidateDirector, 
            finished, getDirectorCandidates, directorCandidates, voteDoneCurrentTurn, 
            hasOpenTableCurrentTurn, openTableCurrentTurn, 
            didVoteCurrentTurn, 
            getCandidates, fenix_promulgations, death_eater_promulgations, updateGameState,
            playerId, enabledSpell, enableSpell, spell, amountPlayers, playerRole,
            playersInfo, getPlayersInfo } = props

    
    const updatePlayers = async() =>{
        await axios.get("http://127.0.0.1:8000/game/"+gameId+"/players_info")
            .then(res=>{
                getPlayersInfo({playersInfo:res.data["Players info"]})
            })
    }
    
    if (playersInfo.length === 0){
        updatePlayers()
    }

    const handleDirectorCandidates = async () => {
        setIsOpen(true)
        if (directorCandidates.length === 0) {
            await axios.get(
                "http://127.0.0.1:8000/game/" + gameId + "/director_candidates"
            ).then(response => {
                if (response.status === 200) {
                    getDirectorCandidates({ directorCandidates: response.data["director candidates"] })
                }
            }).catch(error => {
                if (error.response != undefined && error.response.data != undefined) {
                    console.log(error.response.data)
                }
            })
        }
    }

    const handleCheckCandidates = async () => {
        await axios(
            "http://127.0.0.1:8000/game/" + gameId + "/get_candidates"
        ).then(response => {
            if (response.status === 200) {
                getCandidates({ candidateMinister: response.data.minister_id, candidateDirector: response.data.director_id })
            }
        }).catch(error => {
            if (error.response != undefined && error.response.data != undefined) {
                console.log(JSON.stringify(error.response.data))
            }
        })
    }

    const changeMinister = async () => {
        await axios.put("http://127.0.0.1:8000/game/"+gameId+"/select_MM")
        .then(res => {
        })
    }
    
    const getGameState = async () => {
        await axios.get("http://127.0.0.1:8000/game/"+gameId+"/check_game", { 
        method:'GET',
        headers: {
            'accept': 'application/json',
        }}).then(res => {
            var data = res.data
            if(death_eater_promulgations === 6) 
                {alert("GANARON LOS MORTIFAGOS")}
            else if( fenix_promulgations === 5)
                {alert("GANO LA ORDEN DEL FENIX")}
            updateGameState({
                actualMinister: data["current minister id"],
                actualDirector: data["current director id"],
                finished: data["finished"],
                fenix_promulgations: data["fenix promulgations"],
                death_eater_promulgations: data["death eater promulgations"],
                voteDoneCurrentTurn: data["vote done"]
            })
        })
    }

    const spellsAvaliable = async() => {
        const spellsAvaliable_url = "http://127.0.0.1:8000/game/"
        await axios.get(spellsAvaliable_url + gameId + '/spell'
        ).then(res => {
            if(res.data.Spell != "" && playerId === actualMinister){
                enableSpell({enabledSpell:true, spell:res.data.Spell})
            }
        })
    }

    useInterval(async () => {
        console.log("Checking...")
        await spellsAvaliable()
        await getGameState()
    }, 2000)

    return(
        <div>
            <Envelope playerRole={playerRole}/>
            <div className="gameView">
                <div className="gameBox">
                    <div className="gameSection">
                        <MortifagoBoard 
                            amountPlayers={amountPlayers}
                            death_eater_promulgations= {death_eater_promulgations}/>
                    </div>
                    <div className="gameSection">
                        <div className="buttonSection">
                            <div>
                                <PopUp 
                                type="Jugadores" 
                                enableButton={voteDoneCurrentTurn && !hasOpenTableCurrentTurn} 
                                handleState={undefined}
                                />
                            </div>
                            <div>
                                <PopUp 
                                type="Votar" 
                                enableButton={!didVoteCurrentTurn} 
                                handleState={() => handleCheckCandidates()} 
                                />
                            </div>
                            <div>
                                <PopUp 
                                type="Cartas"
                                enableButton={
                                    (playerId === actualMinister || playerId === actualDirector
                                    || playerId === candidateMinister || playerId === candidateDirector) 
                                    && candidateMinister != candidateDirector} 
                                handleState={undefined}
                                />
                            </div>
                            {(playerId === actualMinister && candidateMinister === candidateDirector)
                            ?(
                                <div >
                                <button
                                    className="app-btn" id="gameButton"
                                    onClick={() => { handleDirectorCandidates() }}
                                >
                                    Elegir Director
                                </button>
                                <Modal
                                    open={isOpen} setIsOpen={setIsOpen}
                                    children={"Director"} candidates={directorCandidates}
                                    onClose={() => setIsOpen(false)}
                                />
                                </div>
                            ):(<></>)
                            }
                        </div>
                    </div>
                    <div className="gameSection">
                        <OrderBoard
                            fenix_promulgations= {fenix_promulgations}/>
                    </div>
                </div>
                <Drawer className="Drawer" anchor='bottom' open={enabledSpell} 
                    onClose={()=>{enableSpell({enabledSpell:false}); changeMinister()}}>
                        <SpellsList spell={spell}/>
                </Drawer>
            </div>    
    </div>);
}

const mapStateToProps = (state) => {
    return {
        gameId: state.game.gameId,
        playerId:state.game.playerId,
        actualMinister: state.game.actualMinister,
        actualDirector: state.game.actualDirector,
        candidateMinister: state.game.candidateMinister,
        candidateDirector: state.game.candidateDirector,
        playerRole: state.game.playerRole,
        finished: state.game.finished,
        directorCandidates: state.game.directorCandidates,
        hasOpenTableCurrentTurn: state.game.hasOpenTableCurrentTurn,
        voteDoneCurrentTurn: state.game.voteDoneCurrentTurn,
        didVoteCurrentTurn: state.game.didVoteCurrentTurn,
        fenix_promulgations: state.game.fenix_promulgations,
        death_eater_promulgations: state.game.death_eater_promulgations,
        enabledSpell: state.game.enabledSpell,
        spell: state.game.spell,
        amountPlayers: state.game.amountPlayers,
        playersInfo: state.game.playersInfo,
    };
}

const mapDispatchToProps = {
    updateGameState,
    enableSpell,
    getPlayersInfo,
    getDirectorCandidates,
    getCandidates,
    openTableCurrentTurn
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);
