import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Vehicles } from "./pages/veiculos/Veiculos";


function App (){
  return(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Vehicles/>}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App