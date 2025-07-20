

export default function TaskSub(task) {

    const todo = task.stringify();

    
    
    return (
        <div>
            <h1>task.data</h1>
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
    )
}