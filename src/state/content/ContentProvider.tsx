'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { setIsError, setCollection, ContentProps } from '@/state/content/contentSlice'

type ContentProvider = {
  children?: React.ReactNode,
};

export default function ContentProvider({
  children
}: ContentProvider) {
  const dispatch = useDispatch<AppDispatch>();

  async function fetchContent() {
    const ref = collection(db, 'content');
    try {
      const snapshot = await getDocs(ref);
      let collection = [];
      for (let doc of snapshot.docs) {
        let { id, title, description, thumbnail } = doc.data() as ContentProps;
        collection.push({ id, title, description, thumbnail });
      }
      dispatch(setCollection(collection));
    } catch(error) {
      dispatch(setIsError(true));
    }
  }

  useEffect(() => {
    fetchContent();
  }, []);

  return children;
}
