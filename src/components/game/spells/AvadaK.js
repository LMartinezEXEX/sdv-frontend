import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import dropdown from '../../lobby/create/Dropdown';
import { enableSpell, setMessageTopCenter, setMessageTopCenterOpen } from "../../../redux/actions";
import { playersUsernamesListExcluding } from '../gameAuxiliars';
import { SERVER_URL, GAME_PATH, SELECT_MM, EXECUTE_SPELL, SPELL_QUERY_STRING } from '../../constantsEndpoints';
import { errorTranslate } from '../../errorTranslate';
import avada from "../../../assets/images/boards/avadakedavra.png";

const useStyles = makeStyles((theme) => ({
    root: {
        border: 0.5,
        boxShadow: '0 0 15px 5px rgba(255, 255, 255, 1)',
        color: 'white',
        width: theme.spacing(12),
        height: theme.spacing(12),
        margin: 20,
        padding: 8,
    },
}));

const AvadaKadavra = (props) => {
    const {
        gameId, playerId, playersInfo,
        enableSpell, setMessageTopCenter, setMessageTopCenterOpen
    } = props
    
    const classes = useStyles();
    
    const players_list = playersUsernamesListExcluding(playersInfo, playerId)

    const changeMinister = async () => {
        await axios.put(
            SERVER_URL + GAME_PATH + gameId + SELECT_MM
        ).then(response => {
            if (response.status === 200) {
                console.log(response.data)
            }
        }).catch(error => {
            if (error.response && error.response.data["detail"] !== undefined) {
                setMessageTopCenter({ 
                    messageSeverity: "warning", 
                    messageTopCenter: errorTranslate(error.response.data["detail"]) 
                })
                setMessageTopCenterOpen({ messageTopCenterOpen: true })
            }
        })
    }

    const [VictimUsername, PlayerDropdown] = dropdown("Asesinar a ", "", players_list);
    
    const useAvada = async() => {
        const victim = playersInfo.filter(player => 
            player.username === VictimUsername)
        await axios.put(
            SERVER_URL + GAME_PATH + gameId + EXECUTE_SPELL + SPELL_QUERY_STRING + 'Avada Kedavra',{
            minister_id: playerId,
            player_id: victim[0].player_id
        }).then(response => {
            if (response.status === 200) {
                setMessageTopCenter({ 
                    messageSeverity: "success", 
                    messageTopCenter: victim[0].username + " asesinado" 
                })
                setMessageTopCenterOpen({ messageTopCenterOpen: true })
                enableSpell({ enabledSpell: false })
                changeMinister()
            }
        }).catch(error => {
            if (error.response && error.response.data["detail"] !== undefined) {
                setMessageTopCenter({ 
                    messageSeverity: "warning", 
                    messageTopCenter: errorTranslate(error.response.data["detail"])
                })
                setMessageTopCenterOpen({ messageTopCenterOpen: true })
            }
        })
    }

    return (
        <>
            <button className="SpellButton"  style={{backgroundColor: 'transparent'}} 
                disabled={VictimUsername.length<1}  onClick={useAvada}>
                    <Avatar src={avada} className={classes.root}/>
                    <h4>Avada Kedavra</h4>          
            </button>
                <PlayerDropdown/>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        gameId: state.game.gameId,
        playerId: state.game.playerId,
        playersInfo: state.game.playersInfo
    };
}

const mapDispatchToProps = {
    enableSpell,
    setMessageTopCenter, setMessageTopCenterOpen
}

export default connect(mapStateToProps, mapDispatchToProps)(AvadaKadavra);    