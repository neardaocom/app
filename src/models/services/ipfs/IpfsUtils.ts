export default class IpfsUtils {
    static makeFileFromString = (value: any, name: string): File[] => {
        const blob = new Blob([value], { type: 'text/plain'})
        return [
            new File([blob], name)
        ]
    }

    static makeFileFromHtml = (value: any, name: string): File[] => {
        const blob = new Blob([value], { type: 'text/html'})
        return [
            new File([blob], name)
        ]
    }

    static makeFileFromObject = (obj: any, name: string): File[] => {
        const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
        return [
            new File([blob], name)
        ]
    }
}