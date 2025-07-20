'use client';

import { useState, useEffect } from "react";

export default function useTasks() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("mytask");
        if(saved) {
            setTasks(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("myTask", JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (task) => {
        setTasks((prev) => [...prev, task]);
    };

    return {tasks, addTask};
}