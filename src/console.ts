
['log', 'warn', 'error'].forEach((methodName) => {
    //@ts-ignore
    const originalMethod = console[methodName]
    //@ts-ignore
    console[methodName] = (...args: any) => {
        let initiator = 'unknown place'
        try {
            throw new Error()
        } catch (e: any) {
            if (typeof e.stack === 'string') {
                let isFirst = true
                for (const line of e.stack.split('\n')) {
                    const matches = line.match(/^\s+at\s+(.*)/)
                    if (matches) {
                        if (!isFirst) {
                            //first line - current function
                            //second line - caller (what we are looking for)
                            initiator = matches[1]
                            break
                        }
                        isFirst = false
                    }
                }
            }
        }
        originalMethod.apply(console, [...args, '\n', `  at ${initiator}`])
    }
})