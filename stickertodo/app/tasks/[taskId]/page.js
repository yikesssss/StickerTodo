'use client'

import { useEffect, useState } from "react"

import TaskSub from "@/components/TaskSub";
import { useParams } from "next/navigation";

export default function TaskDetails() {
    const params = useParams();
    const taskId = params.taskId

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadTask = () => {
        setLoading(true)
        setError(null)
        try {
            const savedTodos = localStorage.getItem("todo-data")
            if(savedTodos) {
                const allTodos = JSON.parse(savedTodos)
                const thisTask = allTodos.find(t => String(t.id) === String(taskId))
                if(thisTask) {
                    setTask(thisTask)
                } else {
                    setError("task not found")
                }
            } else {
                setError("no tasks in storage")
            }
        } catch (err) {
            setError("failed to load task")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTask()

        window.addEventListener('localStorageChange', loadTask);

        return () => {
            window.removeEventListener('localStorageChange', loadTask);
        };

    }, [taskId])

    const updateTaskStorage = (updatedTask) => {
        const savedTodos = localStorage.getItem("todo-data")
        let allTodos = savedTodos ? JSON.parse(savedTodos) : []
        const todoIndex = allTodos.findIndex(t => String(t.id) === String(updatedTask.id))

        if(todoIndex !== -1) {
            allTodos[todoIndex] = updatedTask
        } else {
            allTodos.push(updatedTask)
        }
        localStorage.setItem("todo-data", JSON.stringify(allTodos))
        setTask(updatedTask)
        window.dispatchEvent(new Event('localStorageChange'));
    }

    if(loading) {
        return(
            <p>Loading...</p>
        )
    }

    if(error) {
        return(
            <p>Error: {error}</p>
        )
    }

    if(!task) {
        return(
            <p>Task not found</p>
        )
    }

    return(
        <div>
            <h1>{task.text}</h1>

            <hr/>

            <TaskSub task={task} onUpdateTask={updateTaskStorage} />
            
            <p>this is where the suggested subs would go</p>
        </div>
        
    )
}