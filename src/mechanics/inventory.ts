import { useData } from "@/components/Game/Data"

export type InventoryData = {
    "inventory": { 
        items: string[] 
    }
}

export const useInventory = () => {
    const [getData, setData] = useData<InventoryData>()

    const getInventory = () => {
        return (
            getData("inventory",  { "inventory": { items: [] } }) as InventoryData
        ).inventory
    }

    const addItem = (item: string) => {
        const inventory = getInventory()
        if (!inventory.items.includes(item)) {
            inventory.items.push(item)
            setData("inventory", inventory)
        }
    }

    const removeItem = (item: string) => {
        const inventory = getInventory()
        inventory.items = inventory.items.filter(i => i !== item)
        setData("inventory", inventory)
    }

    const hasItem = (item: string | string[]) => {
        const inventory = getInventory()
        if (Array.isArray(item)) {
            return item.every(i => inventory.items.includes(i))
        }
        return inventory.items.includes(item)
    }

    return {
        getInventory,
        addItem,
        hasItem,
        removeItem
    }
}