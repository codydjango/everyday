const ENVIRONMENT = process.env.ENVIRONMENT
const ENDPOINT = process.env.ENDPOINT
const NODE_ENV = process.env.NODE_ENV
const DEBUG = (ENVIRONMENT === 'development')
const NAMESPACE = 'everyday'
const TIMERINITIAL = 'start timer'
const EARLY = false

const DEFAULTLIST = [
    { text: 'Drink water' },
    { text: 'Make bed' },
    { text: 'Clean dishes' },
    { text: '20 squats' },
    { text: '20 pushups' },
    { text: '20 crunches' },
    { text: 'Drink water' },
    { text: 'Review calendar' },
    { text: 'Review calendar' },
    { text: 'Process email', limit: 20 },
    { text: 'Process voicemail', limit: 20 },
    { text: 'Drink water' },
    { text: 'Lunch', duration: 60 },
    { text: 'Snack', limit: 20 },
    { text: 'Social media break', duration: 20 },
    { text: 'Social media post'},
    { text: 'Drink water' },
    { text: 'Read a chapter' }
]

const CODYLIST = [
    { text: 'Drink water' },
    { text: 'Make bed' },
    { text: 'Clean dishes' },
    { text: '50 squats' },
    { text: '50 pushups' },
    { text: '50 crunches' },
    { text: 'Drink water' },
    { text: 'Commit line of code' },
    { text: 'Code', duration: 60 },
    { text: 'Inbox 0', duration: 20 },
    { text: 'Drink water' },
    { text: 'HackerRank challenge' },
    { text: 'Code', duration: 60 },
    { text: 'Lunch' },
    { text: 'Read a chapter' },
    { text: 'Code', duration: 60 },
    { text: 'Study', duration: 40 },
    { text: 'Snack' },
    { text: 'Peruse social media', limit: 20},
    { text: 'Post on social media' },
    { text: 'Drink water' },
    { text: '50 kettlebell swings' },
    { text: '20 jerk presses' },
    { text: '20 snatches' },
    { text: 'Drink water' }
]

console.log(`NAMESPACE ${NAMESPACE}`)
console.log(`DEBUG ${DEBUG}`)
console.log(`ENVIRONMENT ${ENVIRONMENT}`)
console.log(`ENDPOINT ${ENDPOINT}`)
console.log(`NODE_ENV: ${NODE_ENV}`)

export {
    DEBUG,
    NAMESPACE,
    TIMERINITIAL,
    DEFAULTLIST,
    CODYLIST,
    EARLY,
    ENDPOINT,
    ENVIRONMENT
}
