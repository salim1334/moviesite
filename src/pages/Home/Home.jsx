import styles from './Home.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Main from '../../components/Main/Main'
import Footer from '../../components/Footer/Footer'

function Home() {
  return (
    <div className={styles.home}>
      <Navbar />
      <Main />
      <Footer />
    </div>
  )
}

export default Home