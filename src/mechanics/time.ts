import { useData } from "@/components/Game/Data"
import { usePanelNavigation } from "@/engine/panel"
import GeneralData from "@/data/general.json"
import { animalFriendshipSpread } from "./character"

export type TimeData = {
    time_segment: number
}

export const useTime: () => [
    () => number,
    (amount: number) => void
] = () => {
    const [getData, setData] = useData<TimeData>()
    const navigate = usePanelNavigation()
    const spreadFriendship = animalFriendshipSpread()

    const progressTime = (amount: number) => {
        const current_time = getData("time_segment", 1)
        const new_time = current_time + amount

        if (new_time >= GeneralData.total_actions) {
            navigate("game-over")
        }

        Array(amount).fill(0).forEach((_, i) => {
            console.log("Progressing time", current_time + i)
            spreadFriendship(current_time + i)
        })

        setData("time_segment", new_time)
    }

    const getTime = () => {
        return getData("time_segment", 1)
    }

    return [
        getTime,
        progressTime,
    ]
}