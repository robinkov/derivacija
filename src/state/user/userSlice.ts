import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "@/state/store"
import { Timestamp } from "firebase/firestore"

export type Permission = {
  id: string,
  expirationDate: Timestamp // UNIX time
}

export type UserState = {
  isFetched: boolean,
  email?: string,
  permissions?: Permission[],
}

const initialState: UserState = {
  isFetched: false,
  email: undefined,
  permissions: undefined,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogout: () => initialState,
    setIsFetched: (state, action: PayloadAction<boolean>) => {
      state.isFetched = action.payload
    },
    setUser: (state, action: PayloadAction<Omit<UserState, 'isFetched'>>) => {
      return { ...state, ...action.payload };
    }
  }
});

export const selectUser = (state: RootState) => state.user;

export const { setLogout, setIsFetched, setUser } = userSlice.actions;
export default userSlice.reducer;
