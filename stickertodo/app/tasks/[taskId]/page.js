'use client'

import { useEffect, useState } from "react"

export default function TaskDetails() {
    const [task, setTask] = useState(null);

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem("todo-data") || "[]")
        const selected = tasks[parseInt(id)]
        setTask(selected)
    }, [id])

    if(!task) return <p>Loading...</p>

    return(
        <div>
            <h2>Task: {task.text}</h2>
            <ul>
                
            </ul>
        </div>
        
    )
}