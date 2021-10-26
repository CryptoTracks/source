import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faStop, faStar, faLifeRing, faLink } from '@fortawesome/fontawesome-free-solid'
import { faGithub } from '@fortawesome/fontawesome-free-brands'
library.add(faPlay)
library.add(faStop)
library.add(faStar)
library.add(faLifeRing)
library.add(faLink)
library.add(faGithub)

export default {
  star () {
    return faStar
  },
  stop () {
    return faStop
  },
  play () {
    return faPlay
  },
  lifeRing () {
    return faLifeRing
  },
  link () {
    return faLink
  },
  github () {
    return faGithub
  }
}
