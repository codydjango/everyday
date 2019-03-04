const almostDone = ['Oh wow, you\'re almost done!', 'I believe in you!', 'You\'re almost there!', 'Let\'s do this.']
const halfway = ['You are so focused!', 'Have you had a break lately?', 'Can I interest you in a nice cup of water?', 'You\'re a beast!']
const beginning = ['Wow, so many tasks... You are very ambitious!', 'You look so smart today!', 'What a good day to get a thing done :D']
const hello = ['I knew you\'d be back! :)', 'You look so smart today.', 'It really makes me happy to see you so motivated and studious.', 'What a diligent person you are!', 'Welcome back! It\'s so nice to see you.']
const working = ['Feelings check...', 'Time for water...', 'A wet brain is a happy brain...', 'One day at a time...', 'Slow breaths...', 'Slow and steady...']
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
