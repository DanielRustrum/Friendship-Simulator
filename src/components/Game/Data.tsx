import { createContext, useContext, ReactNode, useState } from "react"

interface DataContextType<T extends Record<string, any>> {
    setData: (key: keyof T, value: T[keyof T]) => void

    getData<K extends keyof T>(key: K): T[K] | undefined
    getData<K extends keyof T, Fallback>(key: K, fallback: Fallback): T[K] | Fallback
}

const DataContext = createContext<DataContextType<any> | null>(null)

export const useData = <T extends Record<string, any>>() => {
    const context = useContext(DataContext) as DataContextType<T> | null

    if (!context) {
        throw new Error("useData must be used within a DataController")
    }

    return [context.getData, context.setData] as const
}

export const setupDataController = <
    DataType extends Record<string, any>
>() => {
    return ({ children }: { children: ReactNode }) => {
        const [data_record, setDataRecord] = useState<DataType>({} as DataType)


        const setData = (key: keyof DataType, value: DataType[keyof DataType]) => {
            setDataRecord((prev) => ({
                ...prev,
                [key]: value,
            }))
        }

        function getData<K extends keyof DataType>(key: K): DataType[K] | undefined
        function getData<K extends keyof DataType, Fallback>(key: K, fallback: Fallback): DataType[K] | Fallback
        function getData<K extends keyof DataType, Fallback>(key: K, fallback?: Fallback): DataType[K] | Fallback | undefined {
            if (!(key in data_record)) return fallback
            return data_record[key] as DataType[K]
        }


        const contextValue: DataContextType<DataType> = {
            setData,
            getData,
        }

        return (
            <DataContext.Provider value={contextValue}>
                {children}
            </DataContext.Provider>
        )
    }
}
