import { ConversationManager, useDialogue } from "@/components/Game/Conversation"
import { useData } from "@/components/Game/Data"
import { Button } from "@/components/UI/Button"
import { useTime } from "@/mechanics/time"

const Scene = () => {
    const [getTime, progressTime] = useTime()
    const { showConversation, triggerConversation } = useDialogue()
    const [getData, setData] = useData()

    return <div className="w-dvw h-dvh flex flex-col items-center justify-center gap-10">
        test
        <Button
            onClick={() => {
                progressTime(1)
            }}
        >
            Clicked: {getTime()}
        </Button>
        <Button
            onClick={() => {
                progressTime(3)
            }}
        >
            Clicked: {getTime()}
        </Button>
        <p>Player Name: {getData("player_name", "Player")}</p>
        <input
            className="border border-gray-300 p-2 rounded"
            placeholder="Enter your name"
            type="text"
            onChange={(e) => {
                setData("player_name", e.target.value)
            }} 
        />
        <Button
            onClick={() => {
                triggerConversation("intro")
                showConversation()
            }}
        >
            Start Intro
        </Button>
        <Button
            onClick={() => {
                triggerConversation("gameover-lonely")
                showConversation()
            }}
        >
            Game Over
        </Button>
    </div>
}

export const Panel = () => (
    <ConversationManager>
        <Scene />
    </ConversationManager>
)


export const name = "tc-fountain"