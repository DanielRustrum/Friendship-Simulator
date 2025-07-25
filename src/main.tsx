import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GameController } from './engine/game'
import { Component } from './engine/types/component'
import { setupDataController } from './components/Game/Data'
import { TimeData } from './mechanics/time'
import { ConversationData } from './components/Game/Conversation'
import { RelationshipData } from './mechanics/relationship'

const panels = Object.fromEntries(
    Object.values(
        import.meta.glob(
            '@panels/**/*.tsx',
            { eager: true }
        )
    ).map((mod: any) => {
        return [mod.name, mod.Panel]
    })
) as { [key: string]: Component }


const Error = ({ }) => <>Help! Navigation Error!</>


type GlobalDataStore  = TimeData | ConversationData | RelationshipData

const Global = () => {
    const DataProvider = setupDataController<GlobalDataStore>()
    return <DataProvider>
        <GameController
            entry_panel='intro'
            PanelErrorComponent={Error}
            panels={panels}
        />
    </DataProvider>
}
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Global />
    </StrictMode>,
)