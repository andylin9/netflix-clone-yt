import { collection, DocumentData, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Movie } from "../typings";

function useList(uid: string | undefined) {
  const [list, setList] = useState<Movie[] | DocumentData[]>([]);

  useEffect(() => {
    if (!uid) return;

    return onSnapshot(
      collection(db, "customeers", uid, "myList"),
      (snapshot) => {
        console.log("useList snapshot: ", snapshot);
        setList(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data,
          }))
        );
      }
    );
  }, [db, uid]);

  return list;
}

export default useList;
