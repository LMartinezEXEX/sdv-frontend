import React from 'react'
import {connect} from 'react-redux'
import {MinisterLogo, DirectorLogo, VoldemortLogo} from './ChargesLogos'
import '../../assets/css/RolsDisplayer.css'

const RolsDisplayer = (props) => {
    const {playersInfo, playerId, gameId,
        actualMinister, actualDirector, playerRole,
        amountPlayers} = props

    const charge = (player) => {
        if (player.player_id == actualMinister) {
            return <MinisterLogo className="ChargeLogo"/>
        } else if (player.player_id == actualDirector) {
            return <DirectorLogo className="ChargeLogo"/>
        } else {
            return ""
        }
    }

    const isVoldemort = (player) => {
        if(player.loyalty === "Voldemort" && 
            (player.player_id === actualMinister || player.player_id === actualDirector)) {
            return (<>
                <VoldemortLogo className="ChargeLogo"/>
            </>)
        }else if (player.loyalty === "Voldemort"){
            return (<>
                <div className="EmptyRol"></div>
                <VoldemortLogo className="ChargeLogo"/>
            </>)
        }
    }

    const isAlive = (player, fenix) =>{
        if(player["is alive"] && fenix){
            return <p className="usernameFenix">{player.username}</p>
        }else if (player["is alive"] && !fenix){
            return <p className="usernameDeath">{player.username}</p>
        }else {
            if(fenix){
                return <p className="usernameFenix deathPlayer">{player.username}</p>
            } else {
                return <p className="usernameDeath deathPlayer">{player.username}</p>
            }
        }
    }
    const displayer = () => {
        if(playerRole === "Death Eater" || (playerRole === "Voldemort" && amountPlayers<=6)){
            const list = playersInfo.map(player=> {  
                if(player.loyalty === "Death Eater"){
                    return(
                        <li>
                            {isAlive(player, false)}
                            <div className="EmptyRol"></div>
                            {charge(player)}
                        </li>)
                }else if(player.loyalty === "Voldemort"){
                    return(
                        <li>
                            {isAlive(player, false)}
                            <div className="RolsContainer">
                                {charge(player)}
                                {isVoldemort(player)}
                            </div>
                        </li>)
                }else{
                    return(
                        <li>
                            {isAlive(player, true)}
                            <div className="RolsContainer">
                                <div className="EmptyRol"></div>
                                {charge(player)}
                            </div>
                        </li>)
                }
                    
                })
            return list
        }else if(playerRole === "Voldemort" && amountPlayers>6){
            const list = playersInfo.map(player=> {
                return(
                    <li>
                        {isAlive(player, true)}
                        <div className="EmptyRol"></div>
                        {charge(player)}
                    </li>)})
            return list
        }else{
            const list = playersInfo.map(player=> 
                        <li>
                            {isAlive(player, true)}
                            <div className="EmptyRol"></div>
                            {charge(player)}
                        </li>)
            return list
        }
    }

    return (
        <div className= "rolsDisplayer">
            <ul>
                {displayer()}
            </ul>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        amountPlayers: state.game.amountPlayers,
        playerRole: state.game.playerRole,
        playersInfo: state.game.playersInfo,
        playerId: state.game.playerId,
        gameId: state.game.gameId,
        actualMinister: state.game.actualMinister,
        actualDirector: state.game.actualDirector
    };
}

export default connect(mapStateToProps, null)(RolsDisplayer);
