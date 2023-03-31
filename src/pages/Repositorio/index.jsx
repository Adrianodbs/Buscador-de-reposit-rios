import { useParams } from 'react-router-dom'
import * as C from './styles'
import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Repositorio() {
  const { repo } = useParams()

  const [repositorio, setRepositorio] = useState({})
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function load() {
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${repo}`),
        api.get(`/repos/${repo}/issues`, {
          params: {
            state: 'open',
            per_page: 5
          }
        })
      ])

      setRepositorio(repositorioData.data)
      setIssues(issuesData.data)
      setLoading(false)
    }

    load()
  }, [repo])

  return <C.Container></C.Container>
}
