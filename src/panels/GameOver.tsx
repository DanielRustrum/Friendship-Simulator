import { useTime } from "@/mechanics/time"

export const Panel = () => {
    const [getTime] = useTime()
    return <>{getTime()}</>
}

export const name = "game-over"