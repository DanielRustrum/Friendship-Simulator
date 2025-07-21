import { Component } from "@/engine/types/component"
import { createContext, useContext, useRef, useState } from "react"
import { Button } from "@ui/Button"
import { useData } from "./Data"

type DialogueEntry = {
    speaker: string
    expression?: string
    text: string
    position: "left" | "right"
    hide?: Array<"left" | "right">
}

export type ConversationData = {
    player_name: string
    characters: {
        demon: string[]
    }
}

const conversations = Object.fromEntries(
    Object.entries(
        import.meta.glob('@assets/text/dialogue/*.json', { eager: true })
    ).map(([path, mod]: [string, any]) => {
        const filename = path.split('/').pop()?.replace('.json', '') || ''
        return [filename, mod.dialogue]
    })
) as { [key: string]: Array<DialogueEntry> }

const ConversationContext = createContext<
    {
        triggerConversation: (dialogue: string) => void
        openDialog: () => void
    } | null
>(null)

export const useDialogue = () => {
    const ConverationMethods = useContext(ConversationContext)

    if (ConverationMethods === null) {
        throw new Error("useDialogue must be used within a ConversationManager")
    }

    const { triggerConversation, openDialog } = ConverationMethods

    return {
        triggerConversation,
        showConversation: openDialog
    }
}

const CharacterSlot: Component<{
    current_conversation: Array<DialogueEntry>,
    conversation_index: number
    position: "left" | "right"
}> = ({
    current_conversation,
    conversation_index,
    position
}) => {
        const ExpressionRef = useRef<string | undefined>(undefined)
        const NameRef = useRef<string | undefined>(undefined)
        const dialogue = current_conversation[conversation_index]
        const [getData] = useData()


        if (conversation_index === 0) {
            ExpressionRef.current = undefined
            NameRef.current = undefined
        }

        if (dialogue && dialogue.position === position) {
            if (dialogue.expression) {
                ExpressionRef.current = dialogue.expression
            }
            if (dialogue.speaker) {
                if (dialogue.speaker === "player") {
                    NameRef.current = getData("player_name") || "Player"
                } else {
                    NameRef.current = dialogue.speaker
                }
            }
        }

        const name = NameRef.current ?? "???"
        const expression = ExpressionRef.current ?? "blank"

        return (
            <div className="w-[30vw] h-[60vh]">
                <div
                    style={{
                        display: dialogue.hide?.includes(position) ? 'none' : 'block'
                    }}
                    className=" bg-orange-300 h-full w-full"
                >
                    <p>{name}</p>
                    <p>{expression}</p>
                </div>
            </div>
        )
    }

export const ConversationManager: Component = ({ children }) => {
    const [current_conversation, setCurrentConversation] = useState<Array<DialogueEntry>>([])
    const [conversation_index, setConversationIndex] = useState(0)
    const DialogRef = useRef<HTMLDialogElement>(null)
    const [getData] = useData()

    const openDialog = () => {
        DialogRef.current?.showModal()
    }

    const triggerConversation = (dialogue: string) => {
        const conversation = conversations[dialogue]
        setCurrentConversation(conversation || [])
    }

    const speaker = current_conversation[conversation_index]?.speaker === "player"? 
        getData("player_name", "You"): 
        current_conversation[conversation_index]?.speaker || "???"
    const capitalizedSpeaker = speaker.charAt(0).toUpperCase() + speaker.slice(1)

    return <ConversationContext.Provider value={{ triggerConversation, openDialog }}>
        {children}
        <dialog
            id="conversation-dialog"
            ref={DialogRef}
            className="
                w-dvw h-dvh fixed top-0 left-0 max-w-none max-h-none m-0 p-0 
                bg-black/30 border-none
            "
        >
            <div className="flex flex-col justify-end h-full w-full">
                <div className="flex justify-between">
                    {current_conversation.length !== 0 &&
                        <>
                            <CharacterSlot
                                position="left"
                                conversation_index={conversation_index}
                                current_conversation={current_conversation}
                            />
                            <CharacterSlot
                                position="right"
                                conversation_index={conversation_index}
                                current_conversation={current_conversation}
                            />
                        </>
                    }
                </div>
                <div className="flex p-5 gap-10 bg-white justify-between h-[20vh]">
                    {current_conversation.length === 0 ?
                        <p>No conversation selected</p> :
                        <div className="flex flex-col items-start gap-5">
                            <p className="font-bold">{capitalizedSpeaker}</p>
                            <p>{current_conversation[conversation_index].text}</p>
                        </div>
                    }


                    <Button
                        onClick={() => {
                            if (conversation_index < current_conversation.length - 1) {
                                setConversationIndex(conversation_index + 1)
                            } else {
                                DialogRef.current?.close()
                                setConversationIndex(0)
                            }
                        }}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </dialog>
    </ConversationContext.Provider>
}