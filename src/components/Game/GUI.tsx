import { useInventory } from "@/mechanics/inventory"
import { useState } from "react"
import { Button } from "../UI/Button"

export const BagGUI = () => {
    const { getInventory, removeItem } = useInventory()
    const [show_items, setShowItems] = useState(false)

    return (
        <div>
            <Button onClick={() => setShowItems(!show_items)}>Bag</Button>
            <ul hidden={!show_items}>
                {getInventory().items.map((item, index) => (
                    <li key={index}>
                        {item}
                        <button onClick={() => removeItem(item)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}