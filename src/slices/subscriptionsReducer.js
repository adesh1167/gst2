import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    deepAnalyzerSubscription: {
        queried: false,
        isActive: null,
        plan: null,
        startDate: null,
        endDate: null,
        error: null,
    }
}

const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {
        setDeepAnalyzerSubscription: (state, action) => {
            console.log("Payload:", action.payload);
            state.deepAnalyzerSubscription = action.payload.error ?
                {
                    ...state.deepAnalyzerSubscription,
                    queried: true,
                    isActive: false,
                    startDate: null,
                    endDate: null,
                    plan: null,
                    error: action.payload.error
                }
                :
                {
                    ...state.deepAnalyzerSubscription,
                    queried: true,
                    isActive: action.payload.active ? true : false,
                    startDate: action.payload.start_date,
                    endDate: action.payload.end_date,
                    plan: action.payload.plan,
                    planName: action.payload.plan === "weekly_sub" ? "Weekly" : (action.payload.plan === "monthly_sub" ? "Monthly" : action.payload.plan),
                    error: action.payload.error
                };
        }
    }
})

export const { setDeepAnalyzerSubscription } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;