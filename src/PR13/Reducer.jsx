const initial = {
    com: [],
    user: []
}

const reducer = (state = initial, action) => {
    switch (action.type) {
        case "addCom": return { ...state, com: action.payload }
            break;
        case "addUser": return { ...state, user: action.payload }
            break;
        default:
            break;
    }
    return state;
}

export default reducer;