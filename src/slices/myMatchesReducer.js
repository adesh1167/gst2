import { createSlice } from "@reduxjs/toolkit"
import { parsePaidMatch } from "../functions/parseFixtures";


const initialState = {
    matches: []
}

const myMatchesSlice = createSlice({
    name: "myMatches",
    initialState,
    reducers: {
        setMyMatches: (state, action) => {
            state.matches = action.payload.map(item=>({
                ...item,
                matches: item.matches.map(match=>parsePaidMatch(match))
            }));
        },
        addMyMatches: (state, action) => {
            state.matches = [...state.matches, ...action.payload];
        }
    }
})

export const { setMyMatches, addMyMatches } = myMatchesSlice.actions;
export default myMatchesSlice.reducer;