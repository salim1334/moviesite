import styles from './Home.module.css'
import Navbar from '../../components/Navbar/Navbar'
import MovieList from '../../components/MovieList/MovieList'
import Footer from '../../components/Footer/Footer'

function Home() {
  return (
    <div className={styles.home}>
      <Navbar />
      <MovieList />
      <Footer />
    </div>
  )
}

export default Home