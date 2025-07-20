"use client"

import { useEffect, useState } from "react"

export default function TaskSub({task, onUpdateTask}) {

    const [newSubtask, setNewSubtask] = useState("")
    const [subtasks, setSubtasks] = useState(task.subtasks || [])

    const [suggestedSubtasks, setSuggestedSubtasks] = useState([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    const [suggestionError, setSuggestionError] = useState(null);

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

    const getAiSuggestions = async () => {
        setIsGeneratingSuggestions(true);
        setSuggestionError(null);
        setSuggestedSubtasks([]); // Clear previous suggestions

        const prompt = `Given the main task "${task.text}", suggest 3-5 concise, actionable sub-tasks. Provide them as a comma-separated list. For example: "Research topic, Write introduction, Draft main body". Do not include any other text or numbering.`;

        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };

            
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            if (!apiKey) {
                setSuggestionError("API Key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.");
                setIsGeneratingSuggestions(false);
                return;
            }
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                // Parse the comma-separated string into an array of strings
                const parsedSuggestions = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
                setSuggestedSubtasks(parsedSuggestions);
            } else {
                setSuggestionError("No suggestions found. Please try again.");
                console.error("Gemini API response structure unexpected:", result);
            }
        } catch (error) {
            setSuggestionError("Failed to fetch suggestions. Please check your network or try again.");
            console.error("Error fetching AI suggestions:", error);
        } finally {
            setIsGeneratingSuggestions(false);
        }
    };

    const addSuggestedSubtask = (suggestionText) => {
        const newSub = { text: suggestionText, complete: false };
        const updatedSubtasks = [...subtasks, newSub];

        setSubtasks(updatedSubtasks);
        onUpdateTask({ ...task, subtasks: updatedSubtasks });

        // Remove the added suggestion from the suggestions list
        setSuggestedSubtasks(prevSuggestions => prevSuggestions.filter(s => s !== suggestionText));
    };
    
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

            <div className="mb-6">
                <button
                    onClick={getAiSuggestions}
                    disabled={isGeneratingSuggestions}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200
            ${isGeneratingSuggestions ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}
            focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                    {isGeneratingSuggestions ? 'Generating Suggestions...' : 'Get AI Subtask Suggestions'}
                </button>
                {suggestionError && (
                    <p className="text-red-400 text-sm mt-2">{suggestionError}</p>
                )}
                {suggestedSubtasks.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-700 rounded-lg shadow-inner">
                        <h3 className="text-md font-semibold text-gray-300 mb-2">Suggested:</h3>
                        <ul className="space-y-2">
                            {suggestedSubtasks.map((suggestion, index) => (
                                <li key={index} className="flex items-center justify-between text-gray-200">
                                    <span>{suggestion}</span>
                                    <button
                                        onClick={() => addSuggestedSubtask(suggestion)}
                                        className="ml-2 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>





            
        </div>
        
    )
}