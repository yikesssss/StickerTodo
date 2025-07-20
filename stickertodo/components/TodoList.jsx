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
        <div className="mt-5">
            {todos.length === 0 ? (
                <p>No tasks to accomplish yet</p>
            ) : (
                <ul>
                    {todos.map((todo, index) => (
                        <li key={todo.id} className="border rounded p-2 m-1 mb-4 flex justify-between items-center">
                            <Link href={`/tasks/${todo.id}`}>{todo.text}</Link>
                            <div>
                                <input type="checkbox"
                                    className="h-5 w-5 border-5 mr-7"
                                    checked={todo.complete}
                                    onChange={() => completeTodo(todo.id)}></input>
                                <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
                            </div>
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
        
    )
}