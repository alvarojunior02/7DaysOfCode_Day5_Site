import { FormEvent, useState } from "react"
import { PlusCircle, Trash } from 'lucide-react'
import { categories } from "./utils/categories"
import { toast } from "sonner"
import Swal from "sweetalert2"

interface ListItemProps {
  id: string,
  itemName: string,
  categoryId: number
}

export function App() {
  const [list, setList] = useState<ListItemProps[]>(() => {
    const listOnStorage = localStorage.getItem('list')

    if (listOnStorage) {
      return JSON.parse(listOnStorage)
    }

    return []
  })
  const [listItemName, setListItemName] = useState('')
  const [listItemCategory, setListItemCategory] = useState(0)

  function handleAddListItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (listItemName === '') {
      toast.warning('Informe o nome do item.')
      return
    }

    if (listItemCategory === 0) {
      toast.warning('Selecione uma categoria válida.');
      return
    }

    const nameExists = list.find(listItem => listItem.itemName === listItemName)

    if (nameExists) {
      toast.warning('Já existe um item com esse nome.')
      return
    }

    const newListItem = {
      id: crypto.randomUUID(),
      itemName: listItemName,
      categoryId: listItemCategory
    }

    const newList = [...list, newListItem]

    setList(newList)

    localStorage.setItem('list', JSON.stringify(newList))

    toast.success('Item adicionado')
  }

  async function handleDeleteListItem(listItemId: string) {
    const { isConfirmed } = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Ao clicar em Deletar, o item será removido permanentemente da lista.',
      icon: 'question',
      confirmButtonText: 'Deletar',
      confirmButtonColor: '#ff0000',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    })

    if (isConfirmed) {
      const newList = list.filter(listItem => (listItem.id !== listItemId))

      setList(newList)

      localStorage.setItem('list', JSON.stringify(newList))

      toast.info('Item removido da lista.')
    }

    return
  }

  function handleSortListByCategory() {
    const listCopy = [...list]
    listCopy.sort((a, b) => a.categoryId - b.categoryId)
    setList(listCopy);
    localStorage.setItem('list', JSON.stringify(listCopy))
  }

  return (
    <div className="flex flex-col items-center justify-start sm:items-start max-w-3xl w-screen h-min p-4 space-y-4">
      <h1 className="font-bold text-2xl text-left">Adicionar item </h1>

      <form
        onSubmit={handleAddListItem}
        className="text-slate-900 grid grid-cols-1 gap-4 sm:grid-cols-6 justify-center items-end"
      >
        <div className="flex flex-col space-y-1 col-span-2">
          <label
            htmlFor="item"
            className="text-slate-50"
          >
            Item:
          </label>
          <input
            className="p-2 rounded-sm px-2"
            type="text"
            name="item"
            placeholder="Nome do item..."
            value={listItemName}
            onChange={(event) => { setListItemName(event.target.value) }}
          />
        </div>

        <div className="flex flex-col space-y-1 col-span-2">
          <label
            htmlFor="category"
            className="text-slate-50"
          >
            Categoria:
          </label>
          <select
            className="p-2 rounded-sm"
            name="category"
            value={listItemCategory}
            onChange={(event) => { setListItemCategory(Number(event.target.value)) }}
          >
            <option value={0}>Selecione uma categoria...</option>
            {
              categories.map(category => {
                return <option key={category.id} value={category.id}>{category.name}</option>
              })
            }
          </select>
        </div>


        <button
          className="bg-slate-50 p-2 hover:bg-slate-200 rounded-sm flex justify-center items-center col-span-2 mt-2"
          type="submit"
        >
          <PlusCircle />
        </button>
      </form>

      <div className="bg-slate-50 h-[1px] w-full" />

      <div className="grid grid-cols-1 gap-4 sm:flex sm:flex-row sm:justify-between sm:items-center sm:w-full">
        <h1 className="font-bold text-2xl text-center">Lista de Compras:</h1>
        <button
          className="bg-slate-50 rounded-md text-slate-900 p-2"
          onClick={handleSortListByCategory}
        >
          Ordenar por Categoria
        </button>
      </div>

      {
        list.length > 0 ? (
          <ul className="flex flex-col w-full space-y-2">
            {
              list.map(listItem => {
                return (
                  <li
                    key={listItem.id}
                    className="bg-slate-50 p-2 text-slate-900 flex flex-row justify-between w-full"
                  >
                    <div>
                      <p className="flex items-center justify-start font-regular text-lg">{listItem.itemName}</p>
                      <span className="flex items-center justify-start italic text-sm">{categories.find(category => category.id === listItem.categoryId)?.name}</span>
                    </div>

                    <button
                      className="bg-none outline-none group p-2"
                      onClick={() => handleDeleteListItem(listItem.id)}
                    >
                      <Trash className="text-red-600 group-hover:text-red-800" />
                    </button>
                  </li>
                )
              })
            }
          </ul>
        ) : (
          <h2 className="font-regular text-lg">Adicione algo...</h2>
        )
      }

    </div>
  )
}