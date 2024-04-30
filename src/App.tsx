
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import todoService from './services/todo.service'
import { SyntheticEvent, useEffect, useState } from 'react'

import { useTodos } from './hooks/useTodos'

const todoId = 1

function App() {

  const [title, setTitle] = useState('')

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    mutate(title)
  }

  // as i understood mutations are used for CRUD operations, here i used CREATE
  const { mutate } = useMutation({
    mutationKey: ['create todo'],
    mutationFn: (title: string) => todoService.create(title),
    onSuccess: async () => {
      setTitle('')
      alert('Todo created')
      await refetch()
    }
  })

  const { isLoading, error, data, isSuccess, isError, refetch } = useTodos()

  const queryClient = useQueryClient() // provides a context of the whole cached data react query is working with

  // const { isLoading, error, data, isSuccess, isError } = useQuery({
  //   queryKey: ['todos', todoId],
  //   queryFn: () => todoService.getAll(),
  //   select: ({ data }) => data,
  //   enabled: true,
  //   retry: 1
  // })

  useEffect(() => {
    isSuccess && alert('data fetched')
    if (isError && error) {
      alert(`Error fetching data: ${error.message}`);
    }
  }, [data, isError, error])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <button 
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ['todos'] // will refetch the data associated with this key
            })
          }}
        >Refresh</button>
        { 
          isLoading 
            ? <h1>Loading...</h1> 
            : data?.length ? (
              <div>
                <h1>Todo: </h1>
                {
                  data.map((todo, index) => (
                    <p key={index}>
                      {todo.id}: {todo.title}
                    </p>
                  ))
                }
              </div>
            ) : <h1>Data not found!</h1>
        }
      </div>

      <div>
        <h2>Create TODO</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder='Enter title'
          />
          <button style={{ marginLeft: '0.5rem' }} type="submit">Create</button>
        </form>
      </div>
    </div>
  )
}

export default App
