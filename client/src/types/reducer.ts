import { User } from "./common";

export interface UserReducerInitialState {
    user:User | null,
    loading: boolean
}