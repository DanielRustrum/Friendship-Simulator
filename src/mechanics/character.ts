import { useRelationship } from "./relationship"

export const animalFriendshipSpread = () => {
    const { getRelationship, updateRelationship } = useRelationship()
    const animals = ["dog", "cat", "bird", "squirrel"]

    return (time: number) => {
        let animalFriends: string[] = []
        let true_friend_quest_completed = false
    
        animals.map(animal => {
            const relationship = getRelationship(animal)
    
            if (relationship.completed_quests.includes("true_friend")) {
                true_friend_quest_completed = true
                return
            }
    
            if (relationship.is_friend) animalFriends.push(animal);
        })
    
        if (true_friend_quest_completed || animalFriends.length === 0) return
    
        const nonFriends = animals.filter(a => !animalFriends.includes(a))
        const remainingFriendsToAdd = 4 - animalFriends.length
        const remainingTime = 9 - time
    
        const chanceToAddFriend = (
            (remainingTime - remainingFriendsToAdd >= 0)?
            1:
            (remainingFriendsToAdd > 0 && remainingTime >= 0)? 
                1 - Math.pow(remainingTime / 9, 2): 
                0
        )
    
        if (Math.random() < chanceToAddFriend && remainingFriendsToAdd > 0) {
            const pick = nonFriends[Math.floor(Math.random() * nonFriends.length)]
            if (pick) updateRelationship(pick, { is_friend: true });
        }
    }
}