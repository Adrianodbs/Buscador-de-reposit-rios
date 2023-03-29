import * as C from './styles'
import { FaGithub, FaPlus } from 'react-icons/fa'

function Main() {
  return (
    <C.Container>
      <h1>
        <FaGithub size={25} />
        Meus repositórios
      </h1>

      <C.Form onSubmit={() => {}}>
        <input type="text" placeholder="Adicionar repositórios" />

        <C.SubmitButton>
          <FaPlus color="#fff" size={14} />
        </C.SubmitButton>
      </C.Form>
    </C.Container>
  )
}

export default Main
