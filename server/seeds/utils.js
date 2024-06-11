export const generateRandomNum = (lower, upper) => {
    return Math.floor(Math.random() * (upper - lower + 1) + lower)
}

export const generateRandomDate = (startYear, endYear) => {
    const start = new Date(startYear, 0, 1).getTime()
    const end = new Date(endYear, 11, 31).getTime()
    const date = new Date(start + Math.random() * (end - start))
    return date
}

export const getRandomElementsFromArray = (arr, num) => {
    const shuffled = arr.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, num)
}

export const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
}
