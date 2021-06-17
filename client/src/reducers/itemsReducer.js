import _ from 'lodash';

export default (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_ITEMS':
            return { ...state, ..._.mapKeys(action.payload, 'id') };
        case 'FETCH_ITEM':
            return { ...state, [action.payload.id]: action.payload };
        case 'ADD_ITEM':
            return {
                ...state,
                message: "Success!"
            };
        default:
            return state;
    }
};
