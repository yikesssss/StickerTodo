"use client"

import { useEffect, useState } from "react"

export default function TaskSub({task, onUpdateTask}) {

    const [newSubtask, setNewSubtask] = useState("")
    const [subtasks, setSubtasks] = useState(task.subtasks || [])

    useEffect(() => {
        setSubtasks(task.subtasks || [])
    }, [task.subtasks])

    const addSubtask = () => {
        if(newSubtask.trim === "") return;

        const newSub = {text: newSubtask.trim(), complete: false}
        const updatedSubtasks = [...subtasks, newSub]
        setNewSubtask('')
        setSubtasks(updatedSubtasks)

        onUpdateTask({...task, subtasks: updatedSubtasks})
    }

    const completeSub = (index) => {
        const updatedSubtasks = subtasks.map((sub, i) => i === index ? {...sub, complete: !sub.complete} : sub)
        setSubtasks(updatedSubtasks)
        onUpdateTask({...task, subtasks: updatedSubtasks})
    }

    const delSub = (index) => {
        const updatedSubtasks = subtasks.filter((_, i) => i !== index)
        setSubtasks(updatedSubtasks)
        onUpdateTask({...task, subtasks: updatedSubtasks})
    }
    
    return (
        <div>
            <div>
                <label>Add new subtask: </label>
                <input
                    type="text"
                    placeholder="Add a new subtask"
                    value={newSubtask}
                    onChange={(e) => { setNewSubtask(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addSubtask();
                        }
                    }}></input>
                <button onClick={addSubtask}>+</button>
            </div>

            {subtasks.length === 0 ? (
                <p>None yet, add one or choose one of the ai suggestions</p>
            ): (
                <ul>
                    {subtasks.map((sub, index) => (
                        <li key={index}>
                            
                            <span
                                className={`ml-2 text-base ${sub.complete ? 'line-through text-gray-400' : 'text-gray-800'
                                    }`}
                            >
                                {sub.text}
                            </span>

                            <input
                                type="checkbox"
                                checked={sub.complete}
                                onChange={() => completeSub(index)}
                                className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                            />
                            <button onClick={() => delSub(index)}>🗑️</button>
                        </li>
                    ))}
                </ul>
            )}




            <div></div>
        </div>
        
    )
}