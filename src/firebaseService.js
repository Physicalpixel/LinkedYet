import {collection, onSnapshot, doc, setDoc, getDoc, updateDoc, arrayUnion, query, deleteDoc, writeBatch, getDocs} from "firebase/firestore"
import {db} from "./firebase"

/**
 * 1. Add a new user with their connections to Firestore.
 */
export const addUserConnections = async (sessionId, userName, connectionNames) => {
	try {
		const usersCol = collection(db, "sessions", sessionId, "users")
		const userRef = doc(usersCol, userName)
		const userSnap = await getDoc(userRef)

		if (!userSnap.exists()) {
			await setDoc(userRef, {
				id: userName,
				connections: connectionNames,
			})
		} else {
			await updateDoc(userRef, {
				connections: arrayUnion(...connectionNames),
			})
		}

		// Ensure all target connections also exist as nodes
		const batch = writeBatch(db)
		for (const connName of connectionNames) {
			const connRef = doc(usersCol, connName)
			batch.set(connRef, {id: connName}, {merge: true})
		}
		await batch.commit()
	} catch (error) {
		console.error("Error adding connections to Firestore:", error)
		throw error // Re-throw to handle in UI if needed
	}
}

/**
 * 2. Real-time subscription
 */
export const subscribeToGraph = (sessionId, onUpdate) => {
	const usersCollection = collection(db, "sessions", sessionId, "users")
	const q = query(usersCollection)

	return onSnapshot(
		q,
		(querySnapshot) => {
			const nodeMap = new Map()
			const rawLinks = []

			// 1. Collect all explicit nodes from Firestore
			querySnapshot.forEach((doc) => {
				const userData = doc.data()
				const userId = userData.id
				if (!userId) return

				if (!nodeMap.has(userId)) {
					nodeMap.set(userId, {id: userId})
				}

				if (userData.connections && Array.isArray(userData.connections)) {
					userData.connections.forEach((connId) => {
						if (connId && connId !== userId) {
							rawLinks.push({source: userId, target: connId})
						}
					})
				}
			})

			// 2. Filter links and ensure both ends exist as nodes
			const links = []
			const processedLinks = new Set()

			rawLinks.forEach(({source, target}) => {
				// Ensure target node exists even if it doesn't have a document yet
				if (!nodeMap.has(target)) {
					nodeMap.set(target, {id: target})
				}

				const linkKey = [source, target].sort().join("-")
				if (!processedLinks.has(linkKey)) {
					links.push({source, target})
					processedLinks.add(linkKey)
				}
			})

			const nodes = Array.from(nodeMap.values())
			onUpdate({nodes, links})
		},
		(error) => {
			console.error("Firestore subscription error:", error)
		},
	)
}

/**
 * 3. Clear all data using a Batch for atomicity
 */
export const clearAllData = async (sessionId) => {
	try {
		const usersCollection = collection(db, "sessions", sessionId, "users")
		const snapshot = await getDocs(usersCollection)

		const batch = writeBatch(db)
		snapshot.docs.forEach((doc) => {
			batch.delete(doc.ref)
		})

		await batch.commit()
		console.log("Firestore: All data cleared successfully.")
	} catch (error) {
		console.error("Error clearing Firestore data:", error)
		throw error
	}
}
