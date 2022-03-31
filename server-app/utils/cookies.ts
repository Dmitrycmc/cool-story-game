export const parseCookies = (str?: string): Record<string, string> | undefined => {
    return str?.split('; ').reduce((acc, str) => {
        const [key, value] = str.split('=');
        return {
            ...acc,
            [key]: value,
        };
    }, {});
};
