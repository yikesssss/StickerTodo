import { useState, useEffect } from "react";
import Modal from "./Modal";

export default function TaskInput() {

    const [data, setData] = useState([])
    const [input, setInput] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    

    useEffect(() => {
        const saveTodoData = localStorage.getItem("todo-data")

        if(saveTodoData) {
            setData(JSON.parse(saveTodoData))
        } else {
            localStorage.setItem("todo-data", JSON.stringify([]))
        }

    }, [])

    const addNewTodo = () => {
        if(input.trim()==="") return;
        const newTodo = {text: input, complete: false, subtasks: []}
        const updatedTodo = [...data, newTodo]
        setData(updatedTodo)
        localStorage.setItem("todo-data", JSON.stringify(updatedTodo))
        setInput("")
    }

    const completeTodo = (index) => {
        const updatedList = [...data]
        updatedList[index].complete = !updatedList[index].complete
        setData(updatedList)
        localStorage.setItem("todo-data", JSON.stringify(updatedList))
    };

    const deleteTodo = (index) => {
        const updatedData  = [...data]
        updatedData.splice(index, 1)
        setData(updatedData)
        localStorage.setItem("todo-data", JSON.stringify(updatedData))
        setIsModalOpen(false)
    }

    const openModal = (index) => {
        setIsModalOpen(true)
    }



    return(
        <div>
            <div className="flex">
                <h3>Add new task: </h3>
                <input
                    value={input}
                    type="text"
                    placeholder=" go to circus"
                    onChange={(e) => { setInput(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addNewTodo();
                        }
                    }}></input>
                {/* <button onClick={() => addNewTodo()}>+</button> */}
            </div>
            
            <div>
                {data.length > 0 ? <div></div> : <p>Add new todo</p>}
                <ul>
                    {data.map((todo, index) => (
                        <div key={index} className="flex">
                            <p>{todo.text}</p>
                            <button onClick={() => deleteTodo(index)}>🗑️</button>
                            <button onClick={() => completeTodo(index)} key={index}>{todo.complete ? "✅" : "⬜"}</button>
                        </div>
                        
                    ))}
                </ul>
            </div>
           
        </div>
    )

    
    
}