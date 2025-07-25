import { Component } from "@/engine/types/component"
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
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
    closing: boolean
}> = ({
    current_conversation,
    conversation_index,
    position,
    closing = false
}) => {
        const ExpressionRef = useRef<string | undefined>(undefined)
        const NameRef = useRef<string | undefined>(undefined)
        const dialogue = current_conversation[conversation_index]
        const [getData] = useData()
        const [animateIn, setAnimateIn] = useState(false)


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
        const isHidden = dialogue.hide?.includes(position)

        useEffect(() => {
            if (conversation_index === 0 && !isHidden) {
                requestAnimationFrame(() => setAnimateIn(true))
            }
        }, [conversation_index, isHidden])

        const slideClass = position === 'left'
            ? '-translate-x-[50vw]'
            : 'translate-x-[50vw]'


        const transitionClass = isHidden || closing
            ? `opacity-0 ${slideClass} pointer-events-none`
            : animateIn
                ? `opacity-100 translate-x-0`
                : `opacity-0 ${slideClass}`

        return (
            <div className="w-[40vw] h-[60vh] overflow-hidden">
                <div
                    className={`
                        bg-orange-300 h-full w-full
                        transition-all duration-1000 ease-out transform
                        ${transitionClass}
                    `}
                >
                    <p>{name}</p>
                    <p>{expression}</p>
                </div>
            </div>
        )
    }

const DialogueBox: Component<{
    text: string
    speaker: string
    closing: boolean
    index: number
    length: number
    onClick: () => void
}> = ({ text, speaker, closing, length, onClick, index }) => {
    const [animateIn, setAnimateIn] = useState(false)
    const boxRef = useRef<HTMLDivElement>(null)

    // Force DOM to render initial hidden state, then trigger animation
    useLayoutEffect(() => {
        if (index === 0) {
            setAnimateIn(false)
            // Force reflow to lock in starting state
            const box = boxRef.current
            if (box) {
                box.getBoundingClientRect() // force DOM reflow
            }
            setAnimateIn(true)
        }
    }, [index])

    const transitionClass = closing
        ? "opacity-0 translate-y-[20vh] pointer-events-none"
        : animateIn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[20vh]"

    return (
        <div
            ref={boxRef}
            className={`
        flex p-5 gap-10 bg-white justify-between h-[20vh]
        transition-all duration-1000 ease-out transform
        ${transitionClass}
      `}
        >
            {length === 0 ? (
                <p>No conversation selected</p>
            ) : (
                <div className="flex flex-col items-start gap-5">
                    <p className="font-bold">{speaker}</p>
                    <p>{text}</p>
                </div>
            )}
            <Button
                className="self-end"
                onClick={onClick}
                disabled={closing}
            >
                Next
            </Button>
        </div>
    )
}



export const ConversationManager: Component = ({ children }) => {
    const [current_conversation, setCurrentConversation] = useState<Array<DialogueEntry>>([])
    const [conversation_index, setConversationIndex] = useState(0)
    const DialogRef = useRef<HTMLDialogElement>(null)
    const [getData] = useData()
    const [closing, setClosing] = useState(false)
    const [animateIn, setAnimateIn] = useState(false)

    const openDialog = () => {
        DialogRef.current?.showModal()
        setAnimateIn(false)
        requestAnimationFrame(() => setAnimateIn(true)) // allow 1 frame delay
    }

    const closeDialog = () => {
        if (conversation_index < current_conversation.length - 1) {
            setConversationIndex(conversation_index + 1)
        } else {
            setClosing(true)

            setTimeout(() => {
                DialogRef.current?.close()
                setClosing(false)
            }, 1000)
        }
    }

    const triggerConversation = (dialogue: string) => {
        const conversation = conversations[dialogue]
        setCurrentConversation(conversation || [])
    }

    const speaker = current_conversation[conversation_index]?.speaker === "player" ?
        getData("player_name", "You") :
        current_conversation[conversation_index]?.speaker || "???"
    const capitalizedSpeaker = speaker.charAt(0).toUpperCase() + speaker.slice(1)

    return <ConversationContext.Provider value={{ triggerConversation, openDialog }}>
        {children}
        <dialog
            id="conversation-dialog"
            ref={DialogRef}
            className={`
                w-dvw h-dvh fixed top-0 left-0 max-w-none max-h-none m-0 p-0 border-none
                transition-all duration-500 ease-out
                backdrop:bg-transparent
                ${animateIn && !closing ? "bg-black/30 opacity-100" : "bg-transparent opacity-0"}
            `}
            onClose={() => {
                setCurrentConversation([])
                setConversationIndex(0)
                setAnimateIn(false)
            }}
        >
            <div className="flex flex-col justify-end h-full w-full overflow-hidden">
                <div className="flex justify-between">
                    {current_conversation.length !== 0 &&
                        <>
                            <CharacterSlot
                                position="left"
                                conversation_index={conversation_index}
                                current_conversation={current_conversation}
                                closing={closing}
                            />
                            <CharacterSlot
                                position="right"
                                conversation_index={conversation_index}
                                current_conversation={current_conversation}
                                closing={closing}
                            />
                        </>
                    }
                </div>
                <DialogueBox
                    text={current_conversation[conversation_index]?.text}
                    speaker={capitalizedSpeaker}
                    closing={closing}
                    length={current_conversation.length}
                    index={conversation_index}
                    onClick={closeDialog}
                />
            </div>
        </dialog>
    </ConversationContext.Provider >
}