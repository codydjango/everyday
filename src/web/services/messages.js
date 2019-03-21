const almostDone = ['you are almost done!', 'i believe in you', 'almost there', 'you are making this day count']
const halfway = ['you are very focused', 'time for a walk?', 'time for a nice cup of water?']
const beginning = ['you are ambitious and motivated', 'you look very smart today', 'what a good day to get a thing done :D']
const hello = ['thanks for coming back :)', 'you look smart today', 'It makes me happy to see you so motivated', 'what a hard-working person you are', 'it\'s so nice to see you']
const working = ['feelings check', 'time for water?', 'a wet brain is a happy brain', 'one step at a time', 'slow breaths', 'slow and steady', 'deep breath']
const randomFromList = list => list[Math.floor(Math.random() * list.length)]

const messages = {
    almostDone,
    halfway,
    beginning,
    hello,
    working
}

export {
    messages,
    randomFromList
}
