'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { collection, getDocs } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import { db, storage } from '@/config/firebase'
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
        try {
          const thumbnailRef = storageRef(storage, thumbnail);
          thumbnail = await getDownloadURL(thumbnailRef);
        } catch (error) {
          console.log(`Problem with fetching thumbnail for ${id}`);
        }
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
