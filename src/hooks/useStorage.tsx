import firebase from 'firebase'
import React from 'react'
import { useAuth } from '../common/AuthProvider'
import { useFirebase } from '../common/FirebaseProvider'

const rootFolder = 'userPhotos'
const useStorage = () => {
  const firebaseApp = useFirebase()
  // Points to userPhotos folder
  const userPhotosRef = firebaseApp.storage().ref().child(rootFolder)

  const getUserPhoto = async (userId: string) => {
    const userFolderRef = userPhotosRef.child(userId)
    // let photo = ''
    const photo = (await userFolderRef.listAll()).items.map(async (item) =>
      console.log(await item.getMetadata())
    )
    // console.log(photo)
  }

  /** Upload image to the storage.
   * @return The file URL.
   */
  const uploadFile = async (userId: string, file: File) => {
    try {
      const userFolderRef = userPhotosRef.child(`${userId}`)
      const metaData: firebase.storage.UploadMetadata = {
        contentType: file.type,
        customMetadata: {
          userId: userId,
          fileType: 'avatarPhoto',
        },
      }
      // console.log(userFolderRef)
      const photoURL: string = await (
        await userFolderRef.child(file.name).put(file, metaData)
      ).ref.getDownloadURL()
      // console.log(photoURL)
      return photoURL
    } catch (error) {
      throw Error(error)
    }
  }

  return { getUserPhoto, uploadFile }
}

export default useStorage
