const ENVIRONMENT = process.env.ENVIRONMENT
const ENDPOINT = process.env.ENDPOINT
const DEBUG = (ENVIRONMENT === 'development')
const NAMESPACE = 'everyday'
const TIMERINITIAL = 'start timer'
const EARLY = false
const TASKS = [
    { id: 1, text: 'Drink water' },
    { id: 2, text: 'Make bed' },
    { id: 3, text: '50 crunches' },
    { id: 4, text: '50 pushups' },
    { id: 5, text: 'Commit a line of code' },
    { id: 6, text: 'Read a chapter' },
    { id: 7, text: 'Solve HackerRank challenge' },
    { id: 8, text: 'Solve LeetCode challenge' },
    { id: 9, text: 'Apply for employment' },
    { id: 10, text: 'Code' },
    { id: 11, text: 'Process email' },
    { id: 12, text: 'Break for lunch' },
    { id: 13, text: 'Break for snack' },
    { id: 14, text: 'Do dishes' },
    { id: 15, text: 'Check voicemail' },
    { id: 16, text: 'Peruse social media' },
    { id: 17, text: 'Post on social media' },
    { id: 17, text: '50 squats' }
]

const DEFAULTLIST = [
    { id: 1, taskId: 1, checked: false },
    { id: 2, taskId: 2, checked: false },
    { id: 3, taskId: 3,  checked: false },
    { id: 4, taskId: 18, checked: false },
    { id: 5, taskId: 4, checked: false },
    { id: 6, taskId: 5, checked: false },
    { id: 7, taskId: 10, checked: false, duration: '1h' },
    { id: 8, taskId: 1, checked: false },
    { id: 9, taskId: 6, checked: false },
    { id: 10, taskId: 7, checked: false },
    { id: 11, taskId: 1, checked: false },
    { id: 12, taskId: 10, checked: false, duration: '1h' },
    { id: 13, taskId: 11, checked: false },
    { id: 14, taskId: 1, checked: false },
    { id: 15, taskId: 12, checked: false },
    { id: 16, taskId: 13, checked: false },
    { id: 17, taskId: 1, checked: false },
    { id: 18, taskId: 14, checked: false },
    { id: 19, taskId: 10, checked: false, duration: '1h' },
    { id: 20, taskId: 15, checked: false },
    { id: 21, taskId: 1, checked: false },
    { id: 22, taskId: 16, checked: false },
    { id: 23, taskId: 10, checked: false, duration: '1h' },
    { id: 24, taskId: 17, checked: false },
]

export {
    DEBUG,
    NAMESPACE,
    TIMERINITIAL,
    TASKS,
    DEFAULTLIST,
    EARLY,
    ENDPOINT,
    ENVIRONMENT
}
