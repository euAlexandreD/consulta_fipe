import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Vehicles } from "./pages/veiculos/Veiculos";
import { VerificaCnpj } from "./pages/cnpj/Cnpj";

function App (){
  return(
  <BrowserRouter>
    <Routes>
      <Route path="/veiculos" element={<Vehicles/>}></Route>
      <Route path="/cnpj" element={<VerificaCnpj/>}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App