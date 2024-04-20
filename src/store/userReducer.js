const initialState = {
    isSignedIn: false,
    userName: 'Conan',
    weight: null,
    height: null,
    goal: null,
    allergies: [],
    likedDishes: [],
    diet: null
}


export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'LOGIN':
            return {
                ...state,
                isSignedIn: payload
            }
        case 'SET_SETTINGS':
            return {
                ...state,
                weight: payload.weight,
                height: payload.height,
                goal: payload.goal,
                allergies: payload.allergies,
                likedDishes: payload.likedDishes
            }
        case 'SET_DIET':
            console.log('SET_DIET', payload)
            return {
                ...state,
                diet: payload,
            }
        default:
            return state;
    }
}