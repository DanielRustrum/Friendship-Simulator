import { Button } from "@/components/UI/button"
import { useTime } from "@/mechanics/time"

export const Panel = () => {
    const [getTime, progressTime] = useTime()
    return <>
        test
        <Button
            onClick={() => {
                progressTime(1)
            }}
        >
            Clicked: {getTime()}
        </Button>
    </>
}

export const name = "tc-fountain"