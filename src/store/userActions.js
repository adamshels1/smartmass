export const loginAction = () => {
    return {
        type: 'LOGIN',
        payload: true
    }
}

export const logoutAction = () => {
    return {
        type: 'LOGIN',
        payload: false
    }
}

export const setSettingsAction = ({
    weight,
    height,
    goal,
    allergies,
    likedDishes
}) => {
    return {
        type: 'SET_SETTINGS',
        payload: {
            weight,
            height,
            goal,
            allergies,
            likedDishes
        }
    }
}

export const setDietAction = (diet) => {
    return {
        type: 'SET_DIET',
        payload: diet
    }
}

export const setMealtimesAction = (mealtimes) => {
    return {
        type: 'SET_MEALTIMES',
        payload: mealtimes
    }
}

export const setCalories = (calories) => {
    return {
        type: 'SET_CALORIES',
        payload: calories
    }
}