import * as C from './styles'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { useState, useCallback, useEffect } from 'react'

import api from '../../services/api'

function Main() {
  const [newRepo, setNewRepo] = useState('')
  const [repositorios, setRepositorios] = useState([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  //Buscar
  useEffect(() => {
    const repoStorage = localStorage.getItem('repos')

    if (repoStorage) {
      setRepositorios(JSON.parse(repoStorage))
    }
  }, [])

  //Salvar alterações
  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repositorios))
  }, [repositorios])

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      async function submit() {
        setLoading(true)
        setAlert(null)
        try {
          if (newRepo === '') {
            throw new Error('Você precisa indicar um repositório')
          }
          const response = await api.get(`repos/${newRepo}`)

          const hasRepo = repositorios.find(repo => repo.name === newRepo)

          if (hasRepo) {
            throw new Error('Repositório duplicado')
          }

          const data = {
            name: response.data.full_name
          }

          setRepositorios([...repositorios, data])
          setNewRepo('')
        } catch (error) {
          setAlert(true)
          console.log(error)
        } finally {
          setLoading(false)
        }
      }

      submit()
    },
    [newRepo, repositorios]
  )

  function handleInputChange(e) {
    setNewRepo(e.target.value)

    setAlert(null)
  }

  const handleDelete = useCallback(
    repo => {
      const find = repositorios.filter(r => r.name !== repo)
      setRepositorios(find)
    },
    [repositorios]
  )

  return (
    <C.Container>
      <h1>
        <FaGithub size={25} />
        Meus repositórios
      </h1>

      <C.Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Adicionar repositórios"
          value={newRepo}
          onChange={handleInputChange}
        />

        <C.SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </C.SubmitButton>
      </C.Form>

      <C.List>
        {repositorios.map(repo => (
          <li key={repo.name}>
            <span>
              <C.DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </C.DeleteButton>
              {repo.name}
            </span>
            <a href="">
              <FaBars size={20} />
            </a>
          </li>
        ))}
      </C.List>
    </C.Container>
  )
}

export default Main
