import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Timestamp } from "firebase/firestore"
import { RootState } from "@/state/store"

type Permission = {
  id: string,
  expirationDate: Timestamp
}

type UserState = {
  isFetched: boolean,
  permissions?: Permission[],
}

const initialState: UserState = {
  isFetched: false,
  permissions: undefined,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogout: () => initialState,
    setIsFetched: (state, action: PayloadAction<boolean>) => {
      state.isFetched = action.payload
    }
  }
});

export const selectUser = (state: RootState) => state.user;

export const { setLogout, setIsFetched } = userSlice.actions;
export default userSlice.reducer;
