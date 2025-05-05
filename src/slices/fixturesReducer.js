import { createSlice } from "@reduxjs/toolkit";
import parseFixtures from "../functions/parseFixtures";

const initialState = {
    fixturesLoaded: false,
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
        },
        setFixturesLoaded: (state, action) => {
            state.fixturesLoaded = action.payload;
        }
    }
})

export const { setFixtures, addFixtures, setFixturesLoaded } = fixturesSlice.actions;
export default fixturesSlice.reducer; 