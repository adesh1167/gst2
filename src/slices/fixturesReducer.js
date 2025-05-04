import { createSlice } from "@reduxjs/toolkit";
import parseFixtures from "../functions/parseFixtures";

const initialState = {
    
    fixtures: []
}

const fixturesSlice = createSlice({
    name: 'fixtures',
    initialState,
    reducers: {
        setFixtures: (state, action) => {
            state.fixtures = parseFixtures(action.payload, {});
        },
        addFixtures: (state, action) => {
            state.fixtures = parseFixtures(action.payload, state.fixtures);
        }
    }
})

export const { setFixtures, addFixtures } = fixturesSlice.actions;
export default fixturesSlice.reducer; 