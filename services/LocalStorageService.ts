export const saveJwt = (jwt: string) => {
    localStorage.setItem('token', jwt);
};

export const getJwt = () => {
    return localStorage.getItem('token');
};
