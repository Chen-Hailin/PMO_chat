import {CHANGE_CHANNEL,
    APPROVE_CHANNEL,
    WITHDRAW_APPROVAL,
    RECEIVE_CHANNEL_UPDATE,
    RECEIVE_CHANNEL_STATUS,
    UPDATE_CHANNEL} from '../constants/ActionTypes';

const initialState = {
    name: 'Lobby',
    id: 0,
    caseLocation: '',
    caseDescription: '',
    efForce: '',
    approved: false
};

export default function activeChannel(state = initialState, action) {
    switch (action.type) {
        case CHANGE_CHANNEL:
            return {
                name: action.channel.name,
                id: action.channel.id,
                caseLocation: action.channel.caseLocation,
                caseDescription: action.channel.caseDescription,
                efForce: action.channel.efForce,
                approved: action.channel.approved
            };
        case RECEIVE_CHANNEL_STATUS:
            if (action.channel.name === state.name) {
                return {
                    name: action.channel.name,
                    id: action.channel.id,
                    caseLocation: action.channel.caseLocation,
                    caseDescription: action.channel.caseDescription,
                    efForce: action.channel.efForce,
                    approved: action.channel.approved
                };
            } else {
                return state;
            }
        case APPROVE_CHANNEL:
            console.log("another reducer receive");
            return {
                name: action.channel.name,
                id: action.channel.id,
                caseLocation: action.channel.caseLocation,
                caseDescription: action.channel.caseDescription,
                efForce: action.channel.efForce,
                approved: true
            };

        case WITHDRAW_APPROVAL:
            console.log("another reducer receive");
            return {
                name: action.channel.name,
                id: action.channel.id,
                caseLocation: action.channel.caseLocation,
                caseDescription: action.channel.caseDescription,
                efForce: action.channel.efForce,
                approved: false
            };
        case UPDATE_CHANNEL:
            if (action.channel.name === state.name) {
                return {
                    name: action.channel.name,
                    id: action.channel.id,
                    caseLocation: action.channel.caseLocation,
                    caseDescription: action.channel.caseDescription,
                    efForce: action.channel.efForce,
                    approved: action.channel.approved
                };
            } else {
                return state;
            }
        case RECEIVE_CHANNEL_UPDATE:
            if (action.channel.name === state.name) {
                return {
                    name: action.channel.name,
                    id: action.channel.id,
                    caseLocation: action.channel.caseLocation,
                    caseDescription: action.channel.caseDescription,
                    efForce: action.channel.efForce,
                    approved: action.channel.approved
                };
            } else {
                return state;
            }
        default:
            return state;
    }
}
