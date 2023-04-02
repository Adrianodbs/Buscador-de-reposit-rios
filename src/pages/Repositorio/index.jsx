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
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState([
    { state: 'all', label: 'Todas', active: true },
    { state: 'open', label: 'Abertas', active: false },
    { state: 'closed', label: 'Fechadas', active: false }
  ])
  const [filterIndex, setFilterIndex] = useState(0)

  useEffect(() => {
    async function load() {
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${repositorio}`),
        api.get(`/repos/${repositorio}/issues`, {
          params: {
            state: filter.find(f => f.active).state,
            per_page: 5
          }
        })
      ])
      setRepo(repositorioData.data)
      setIssues(issuesData.data)
      setLoading(false)
    }

    load()
  }, [repositorio])

  useEffect(() => {
    async function loadIssue() {
      const response = await api.get(`/repos/${repositorio}/issues`, {
        params: {
          state: filter[filterIndex].state,
          page,
          per_page: 5
        }
      })

      setIssues(response.data)
    }

    loadIssue()
  }, [page, filter, filterIndex, repositorio])

  function handlePage(action) {
    setPage(action === 'back' ? page - 1 : page + 1)
  }

  function handleFilter(index) {
    setFilterIndex(index)
  }

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

      <C.FilterList active={filterIndex}>
        {filter.map((f, index) => (
          <button
            type="button"
            key={f.label}
            onClick={() => handleFilter(index)}
          >
            {f.label}
          </button>
        ))}
      </C.FilterList>

      <C.IssuesList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a hrfe={issue.html_url}>{issue.title}</a>

                {issue.labels.map(label => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </C.IssuesList>
      <C.PageActions>
        <button
          disabled={page < 2}
          type="button"
          onClick={() => handlePage('back')}
        >
          Voltar
        </button>
        <button type="button" onClick={() => handlePage('next')}>
          Próxima
        </button>
      </C.PageActions>
    </C.Container>
  )
}
