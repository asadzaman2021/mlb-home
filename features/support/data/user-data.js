export const USER_TYPES = {
    MLBALL: 'mlball',
    MLBAUDIO: 'mlbaudio',
    SINGLETEAM: 'singleteam',
    MLBAPP: 'mlbapp',
};

export const userLogins = {
    entitled: {
        npd: {
            mlball: { username: 'mlbtv-mlball-svod@mlb.com', password: 'Baseball1234' },
            mlbaudio: { username: 'mlbtv-audio-svod@mlb.com', password: 'Baseball1234' },
            singleteam: { username: 'stp-oak-svod@mlb.com', password: 'Baseball1234' },
        },
        prod: {
            mlball: { username: 'mlbtv-mlball-svod@mlb.com', password: 'Baseball1234' },
            mlbaudio: { username: 'mlbtv-audio-svod@mlb.com', password: 'Baseball1234' },
            singleteam: { username: 'stp-oak-svod@mlb.com', password: 'Baseball1234' },
            mlbapp: { username: 'mlbapp-svod@mlb.com', password: 'Baseball1234' },
        },
    },
    unentitled: {
        npd: {
            mlball: { username: 'mlbtv-mlball@mlb.com', password: 'Baseball1234' },
        },
        prod: {
            mlball: { username: 'mlbtv-mlball@mlb.com', password: 'Baseball1234' },
        },
    },
};
