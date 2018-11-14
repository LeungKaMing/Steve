const arr = [
    {
        id: 1,
        name: 'ljm'
    },
    {
        id: 2,
        name: 'leung'
    },
    {
        id: 3,
        name: 'jm'
    }
]

export function fetchItem (id) {
    return new Promise((resolve, reject) => {
        arr.find((item) => {
            if (item.id === id) {
                resolve(item)
            } else {
                reject(0)
            }
        })
    })
}