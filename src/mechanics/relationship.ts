import { useData } from "@/components/Game/Data"

export type RelationshipData = {
    [character: string]: {
        completed_quests: string[]
        is_friend: boolean
        current_quests: string[]
    }
}

export const useRelationship = () => {
    const [getData, setData] = useData<RelationshipData>()

    const getRelationship = (character: string) => {
        return getData(character, {
            completed_quests: [],
            is_friend: false,
            current_quests: []
        }) as RelationshipData[string]
    }

    const updateRelationship = (character: string, updates: Partial<RelationshipData[string]>) => {
        const currentData = getRelationship(character)
        setData(character, { ...currentData, ...updates })
    }

    const startQuest = (character: string, questId: string) => {
        const currentData = getRelationship(character)
        if (!currentData.current_quests.includes(questId)) {
            currentData.current_quests.push(questId)

            updateRelationship(character, { 
                current_quests: currentData.current_quests,
            })
        }
    }

    const becomeFriend = (character: string) => {
        const currentData = getRelationship(character)
    
        if (!currentData.is_friend) {
            updateRelationship(character, { is_friend: true })
        }
    }

    const breakFriendship = (character: string) => {
        const currentData = getRelationship(character)
    
        if (currentData.is_friend) {
            updateRelationship(character, { is_friend: false })
        }
    }

    const completeQuest = (character: string, questId: string) => {
        const currentData = getRelationship(character)
        
        if (!currentData.completed_quests.includes(questId)) {
            currentData.completed_quests.push(questId)

            updateRelationship(character, { 
                completed_quests: currentData.completed_quests,
                current_quests: currentData.current_quests.filter(q => q !== questId) 
            })
        }
    }

    return {
        getRelationship,
        updateRelationship,
        startQuest,
        completeQuest,
        becomeFriend,
        breakFriendship
    }
}