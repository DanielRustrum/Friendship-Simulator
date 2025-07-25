type DialogueEntry = {
    speaker: string
    expression?: string
    text: string
    position: "left" | "right"
    hide?: Array<"left" | "right">
    reward: {}
    decisions?: Array<{
        text: string
    }>
        
}

export type ConversationData = {
    player_name: string
    characters: {
        demon: string[]
    }
}

const dialogs = Object.fromEntries(
    Object.entries(
        import.meta.glob('@assets/text/dialogue/*.json', { eager: true })
    ).map(([path, mod]: [string, any]) => {
        const filename = path.split('/').pop()?.replace('.json', '') || ''
        return [filename, mod.dialogue]
    })
) as { [key: string]: Array<DialogueEntry> }