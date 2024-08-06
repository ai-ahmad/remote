import HeaderComponent from "../src/components/layout/Header"
import AboutSection from './components/layout/About'
import CompanyLogo from "./components/layout/CompanyLogo"
import DeveloperList from "./components/layout/Developers"
import Footer from "./components/layout/Footer"
import Showcase from "./components/layout/Showcase"

const App = () => {
  return (
    <div>
    <HeaderComponent/>  
    <Showcase/>
    <AboutSection/>
    <DeveloperList/>
    <CompanyLogo/>
    <Footer/>

     </div>
  )
}

export default App;
