import { EventForm, EventScreen } from './admin/eventForm'
import DataTable from './admin/eventTable'
import { SessionScreen } from './admin/sessionForm'
import './App.css'
import LoginScreen from './auth/loginScreen'

function App() {
  return (
    <>
      {/* <LoginScreen /> */}
      <DataTable/>
      {/* Sample of using GenericDialog (Can be wrapped) */}
      {/* <GenericDialog
        trigger={<Button variant="contained" color="primary">Otwórz Ustawienia Lokalizacji</Button>}
        title="Użycie Usług Lokalizacyjnych"
        content="Czy zezwalasz na anonimowe wysyłanie danych o lokalizacji do Google?"
        onConfirm={handleLocationConfirmation}
      /> */}
      {/* <EventScreen/> */}
      {/* <SessionScreen /> */}
    </>
  )
}

export default App
