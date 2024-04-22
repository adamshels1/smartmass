const initialState = {
    isSignedIn: false,
    userName: 'Conan',
    weight: null,
    height: null,
    goal: null,
    allergies: [],
    likedDishes: [],
    diet: null,
    mealtimes: [],
    calories: null,
    messages: [],
    step: 0,
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
        case 'SET_MEALTIMES':
            console.log('SET_MEALTIMES', payload)
            return {
                ...state,
                mealtimes: payload,
            }
        case 'SET_CALORIES':
            console.log('SET_CALORIES', payload)
            return {
                ...state,
                calories: payload,
            }
        case 'SET_MESSAGES':
            console.log('SET_MESSAGES', payload)
            return {
                ...state,
                messages: payload,
            }
        case 'SET_STEP':
            console.log('SET_STEP', payload)
            return {
                ...state,
                step: payload,
            }
        default:
            return state;
    }
}