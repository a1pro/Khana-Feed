import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface InitialSlice {
  isOnBoarded: boolean;
  token: string | null;
  isTermsAccepted: boolean;
  isRegistered: { email: string; registered: boolean } | null;
}

// Define the initial state using that type
const initialState: InitialSlice = {
  isOnBoarded: false,
  token: null,
  isTermsAccepted: false,
  isRegistered: null,
};

export const initialSlice = createSlice({
  name: "initial",
  initialState,
  reducers: {
    setIsOnBoarded: (state, action: PayloadAction<boolean>) => {
      state.isOnBoarded = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setIsTermsAccepted: (state, action: PayloadAction<boolean>) => {
      state.isTermsAccepted = action.payload;
    },
    setIsRegistered: (state, action: PayloadAction<any>) => {
      state.isRegistered = action.payload;
    },
  },
});

export const { setToken, setIsOnBoarded, setIsTermsAccepted, setIsRegistered } =
  initialSlice.actions;

export default initialSlice.reducer;
