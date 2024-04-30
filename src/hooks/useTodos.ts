import { useQuery } from '@tanstack/react-query'
import todoService from '../services/todo.service'
import { AxiosResponse } from 'axios'
import { ITodo } from '../app.interfaces'

const todoId = 1

const data : { data : ITodo[] } = {
    data: [
       {
        id: 1,
        completed: false,
        title: 'hello',
        userId: 1
       } 
    ]
}

export const useTodos = () => {
    return useQuery({
        queryKey: ['todos'], // has to be unique, to correctly extract cached data
        queryFn: () => todoService.getAll(), //function in services
        select: ({ data }) => data,
        enabled: true,
        retry: 1, // will change the time of showing a loading state before showing the error message
        initialData: () => {
            return data // in Next.js there is another way
        }
    })
}

// to pass a variable
// export const useTodos = () => {
//     return useQuery({
//         queryKey: ['todos', todoId],
//         queryFn: () => todoService.getById(todoId.toString()), //function in services
//         select: ({ data }) => data,
//         enabled: !!todoId, //checking if todoId exists before fetching
//         retry: 1 // will change the time of showing a loading state before showing the error message
//       })
// }