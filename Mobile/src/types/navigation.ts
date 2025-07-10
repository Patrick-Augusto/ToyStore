// Navigation types for the app
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
};

export type MainTabParamList = {
    Dashboard: undefined;
    Clients: undefined;
    Reports: undefined;
    Stats: undefined;
    Settings: undefined;
};

export type ClientsStackParamList = {
    ClientsList: undefined;
    AddEditClient: { client?: any };
};
