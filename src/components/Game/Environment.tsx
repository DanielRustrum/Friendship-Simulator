import { Component } from "@/engine/types/component"
import { Popover, PopoverContent, PopoverTrigger  } from "../UI/popover"


export const Environment: Component<{
    item: string
}> = ({ }) => {
    return (
        <Popover>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
    )
}