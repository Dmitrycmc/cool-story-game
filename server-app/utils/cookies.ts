export const parseCookies = (str?: string): Record<string, string> => {
    return (
        str?.split('; ').reduce((acc, str) => {
            const [key, value] = str.split('=');
            return {
                ...acc,
                [key]: value,
            };
        }, {}) || {}
    );
};
