import { useParams } from 'react-router-dom'
import * as C from './styles'
import { useState, useEffect } from 'react'
import api from '../../services/api'

import { FaArrowLeft } from 'react-icons/fa'

export default function Repositorio() {
  const { repositorio } = useParams()

  const [repo, setRepo] = useState({})
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function load() {
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${repositorio}`),
        api.get(`/repos/${repositorio}/issues`, {
          params: {
            state: 'open',
            per_page: 5
          }
        })
      ])

      console.log(repositorioData.data)

      setRepo(repositorioData.data)
      setIssues(issuesData.data)
      setLoading(false)
    }

    load()
  }, [repositorio])

  if (loading) {
    return (
      <C.Loading>
        <h1>Carregando</h1>
      </C.Loading>
    )
  }

  return (
    <C.Container>
      <C.BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </C.BackButton>
      <C.Owner>
        <img src={repo.owner.avatar_url} alt={repo.owner.login} />
        <h1>{repo.name}</h1>
        <p>{repo.description}</p>
      </C.Owner>
    </C.Container>
  )
}
