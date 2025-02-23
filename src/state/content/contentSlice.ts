import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type ContentProps = {
  id: string
  title: string,
  description: string,
  thumbnail?: string
};

type ContentCollection = {
  isLoading: boolean,
  isError: boolean,
  collection: ContentProps[],
};

const initialState: ContentCollection = { isLoading: true, isError: false, collection: [] };

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLogout: () => initialState,
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setIsError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
      state.isLoading = false;
    },
    setCollection: (state, action: PayloadAction<ContentProps[]>) => {
      state.collection = action.payload;
      state.isLoading = false;
    }
  }
});

export const selectAllContent = (state: RootState) => state.content.collection;

export const selectContent = (id: string) => (state: RootState) => {
  const allContent = state.content.collection;
  let match = null;
  for (let content of allContent) {
    if (!match && content.id === id) {
      match = content;
    }
  }
  return match;
}

export const selectContentStatus = (state: RootState) => {
  return { isError: state.content.isError, isLoading: state.content.isLoading };
};

export const { setCollection, setIsError, setIsLoading } = contentSlice.actions;

export type { ContentProps };
export default contentSlice.reducer;
