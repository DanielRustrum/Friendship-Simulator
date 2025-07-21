import { useData } from "@/components/Game/Data"
import { usePanelNavigation } from "@/engine/panel"
import GeneralData from "@/data/general.json"

export type TimeData = {
    time_segment: number
}

export const useTime: () => [
    () => number,
    (amount: number) => void
] = () => {
    const [getData, setData] = useData<TimeData>()
    const navigate = usePanelNavigation()

    const progressTime = (amount: number) => {
        const time = getData("time_segment", 1) + amount

        if (time >= GeneralData.total_actions) {
            navigate("game-over")
        }

        setData("time_segment", getData("time_segment", 1) + amount)
    }

    const getTime = () => {
        return getData("time_segment", 1)
    }

    return [
        getTime,
        progressTime,
    ]
}