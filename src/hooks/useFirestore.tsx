import firebase from 'firebase'
import { useCallback, useLayoutEffect, useState } from 'react'
import Pocket from '../AppTypes'
import { useFirebase } from '../common/FirebaseProvider'
import useStorage from './useStorage'

const useFirestore = () => {
  const firebaseApp = useFirebase()
  const [db, setDb] = useState<firebase.firestore.Firestore>(
    firebase.firestore(firebaseApp)
  )
  const { uploadFile } = useStorage()

  useLayoutEffect(() => {
    setDb(firebase.firestore(firebaseApp))
    return () => {}
  }, [firebaseApp])

  /** Update a record by Id. */
  const updateRecord = useCallback(
    async (
      recordId: string | 'new',
      userId: string,
      newRecord: Partial<Omit<Pocket.Record, 'id' | 'userId'>>
    ) => {
      if (db) {
        try {
          const docRef = db
            ?.collection('records')
            .doc(recordId === 'new' ? undefined : recordId)

          const recordToUpdate = { userId: userId, ...newRecord }

          await docRef.set({
            ...recordToUpdate,
          })
          const updatedRecord = { id: recordId, ...recordToUpdate }
          return updatedRecord
        } catch (err) {
          throw Error(err)
        }
      }
    },
    [db]
  )

  /** Get user's profile and list of records. */
  const getUserProfile = useCallback(
    async (userId: string = 'test userId', isPublic: boolean = true) => {
      if (db) {
        try {
          const userDocRef = db.collection('users').doc(userId)
          let recordsQuery = db
            ?.collection('records')
            .where('userId', '==', userId)
          if (isPublic) {
            recordsQuery = recordsQuery.where('isPublic', '==', true)
          }

          return db.runTransaction(async (transaction) => {
            const user = await transaction.get(userDocRef)
            if (!user.exists) throw Error('User does not exist!')

            // get all public records
            const records = (await recordsQuery.get()).docs.map(
              (d) =>
                new Pocket.Record({
                  id: d.id,
                  ...d.data(),
                })
            )
            // console.log({ userProfile: user.data(), records: records })
            return {
              userProfile: {
                ...user.data(),
                dob: (
                  user.data()?.dob as firebase.firestore.Timestamp
                ).toDate(),
              },
              records: records,
            }
          })
        } catch (err) {
          throw Error(err)
        }
      }
    },
    [db]
  )

  /** Update user profile. */
  type UserProfileWithPhoto = Partial<Pocket.UserProfile> & {
    photo: File | null
  }
  const updateUserProfile = async (
    userId: string,
    newProfile: UserProfileWithPhoto
  ) => {
    if (db) {
      try {
        const userDocRef = db.collection('users').doc(userId)
        return db.runTransaction(async (transaction) => {
          const user = await transaction.get(userDocRef)
          if (!user.exists) throw Error('User does not exist!')

          let newPhotoUrl = null
          if (newProfile.photo) {
            newPhotoUrl = await uploadFile(userId, newProfile.photo).catch(
              (e) => {
                console.error('Upload photo fail.')
                throw Error(e)
              }
            )
          }

          const { photo, ...updatedProfile } = {
            ...newProfile,
            photoUrl: newPhotoUrl ?? newProfile.photoUrl ?? '',
          }
          // console.log(updatedProfile as Pocket.UserProfile)
          transaction.update(userDocRef, { ...updatedProfile })
          return updatedProfile as Pocket.UserProfile
        })
      } catch (err) {
        throw Error(err)
      }
    }
  }

  /** Add new user and return back the user data. */
  const addUser = useCallback(async () => {
    if (db)
      try {
        const user = (
          await (
            await db?.collection('users').add({
              name: 'Test',
              gender: 'test',
            })
          ).get()
        ).data()
        return user
      } catch (err) {
        throw Error(err)
      }
  }, [db])

  /** Return the user by documentId. */
  const getUser = useCallback(
    async (docId: string = 'Tui') => {
      if (db) {
        try {
          const user = (await db?.collection('users').doc(docId).get()).data()
          return user
        } catch (err) {
          throw Error(err)
        }
      }
    },
    [db]
  )

  return {
    addUser,
    getUser,
    // getRecords,
    updateRecord,
    getUserProfile,
    updateUserProfile,
  }
}

export default useFirestore
