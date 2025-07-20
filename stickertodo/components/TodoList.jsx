"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function TodoList() {
    const [todos, setTodos] = useState([])

    const loadTodos = () => {
        const savedTodos = localStorage.getItem("todo-data")
        if(savedTodos) {
            setTodos(JSON.parse(savedTodos))
        } else {
            localStorage.setItem("todo-data", JSON.stringify([]))
            setTodos([])
        }
    }

    useEffect(() => {
        loadTodos()

        window.addEventListener('localStorageChange', loadTodos)

        return () => {
            window.removeEventListener('localStorageChange', loadTodos)
        }
    }, [])
    
    const completeTodo = (id) => {
        const updatedList = todos.map(todo => 
            todo.id === id ? {...todo, complete: !todo.complete} : todo)
        setTodos(updatedList)
        localStorage.setItem("todo-data", JSON.stringify(updatedList))
        window.dispatchEvent(new Event('localStorageChange'))
    }

    const deleteTodo = (id) => {
        const list = todos.filter(todo => todo.id !== id)
        setTodos(list)
        localStorage.setItem("todo-data", JSON.stringify(list))
        window.dispatchEvent(new Event('localStorageChange'))
    }

    return (
        <div>
            {todos.length === 0 ? (
                <p>No tasks to accomplish yet</p>
            ) : (
                <ul>
                    {todos.map((todo, index) => (
                        <li key={todo.id}>
                            <Link href={`/tasks/${todo.id}`}>{todo.text}</Link>
                            <input type="checkbox"
                            checked={todo.complete}
                            onChange={() => completeTodo(todo.id)}></input>
                            <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
                            {/* <button onClick={() => completeTodo(todo.id)}></button> */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
        // <table>
        //     <thead>
        //         <tr>
        //             <th>Task Name</th>
        //             <th>Is done?</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         <tr>
        //             <td>go to park</td>
        //             <td>[ ]</td>
        //         </tr>
        //     </tbody>
            
        // </table>
    )
}