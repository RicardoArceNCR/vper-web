import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import LogoStrip from './components/LogoStrip/LogoStrip'
import Work from './components/Work/Work'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
