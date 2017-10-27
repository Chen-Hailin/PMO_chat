import {CHANGE_CHANNEL} from '../constants/ActionTypes';

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
        default:
            return state;
    }
}
