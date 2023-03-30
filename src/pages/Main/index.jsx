import * as C from './styles'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { useState, useCallback } from 'react'

import api from '../../services/api'

function Main() {
  const [newRepo, setNewRepo] = useState('')
  const [repositorios, setRepositorios] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      async function submit() {
        setLoading(true)
        try {
          const response = await api.get(`repos/${newRepo}`)

          const data = {
            name: response.data.full_name
          }

          setRepositorios([...repositorios, data])
          setNewRepo('')
        } catch (error) {
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

      <C.Form onSubmit={handleSubmit}>
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
