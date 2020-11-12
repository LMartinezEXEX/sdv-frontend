import { REGISTER, LOGIN, LOGOUT, UPDATE_USERNAME, CREATE_GAME, JOIN_GAME, INIT_GAME, UPDATE_MINISTER, UPDATE_GAME, ENABLE_SPELL} from './actionsTypes';

export const register = (content) => ({
    type: REGISTER,
    payload: {
        content
    }
})

export const login = (content) => ({
    type: LOGIN,
    payload: {
        isAuth: content.isAuth,
        type: content.type,
        authorization: content.authorization,
        email: content.email,
        username: content.username
    }
})

export const logout = (content) => ({
    type: LOGOUT,
    payload: {
        content
    }
})

export const createGame = (content) => ({
    type: CREATE_GAME,
    payload: {
        gameId: content.gameId,
        playerId: content.playerId,
        minPlayers: content.minPlayers,
        maxPlayers: content.maxPlayers
    }
})

export const joinGame = (content) => ({
    type: JOIN_GAME,
    payload: {
        gameId: content.gameId,
        playerId: content.playerId
    }
})

export const initGame = (content) => ({
    type: INIT_GAME,
    payload: {
        init: content.init,
        actualMinister: content.actualMinister
    }
})

export const updateUsername = (content) => ({
    type: UPDATE_USERNAME,
    payload: {
      username: content.newUsername
    }
})

export const updateMinister = (content) => ({
    type: UPDATE_MINISTER,
    payload: {
        newMinister: content.newMinister
    }
})

export const updateGameState = (content) => ({
    type: UPDATE_GAME, 
    payload: {
        actualMinister: content.actualMinister,
        actualDirector: content.actualDirector,
        finished: content.finished,
        fenix_promulgations: content.fenix_promulgations,
        death_eater_promulgations: content.death_eater_promulgations,
    }
})

export const enableSpell = (content) => ({
    type: ENABLE_SPELL,
    payload: {
        enabledSpell: content.enabledSpell,
        spell: content.spell
    }
})